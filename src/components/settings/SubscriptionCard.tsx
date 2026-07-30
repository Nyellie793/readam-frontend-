"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";
import STUDENT from "@/services/student.service";
import type { EntitlementResponse, ProductResponse } from "@/types/api.types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function SubscriptionCard() {
  const [entitlements, setEntitlements] = useState<EntitlementResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([STUDENT.getSubscriptions(), STUDENT.getProducts()])
      .then(([subs, prods]) => {
        setEntitlements(subs.entitlements);
        setProducts(prods);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const productName = (code: string) => products.find((p) => p.code === code)?.name ?? code;

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">AI Session Credits</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              These are prepaid AI-tutor credit packs, not a recurring subscription — no auto-renewal, nothing to cancel.
            </CardDescription>
          </div>
          {entitlements.length > 0 && (
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <p className="text-xs text-gray-400">Loading…</p>
        ) : entitlements.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
              <Sparkles className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">No active AI credits</p>
              <p className="mt-1 text-xs text-gray-500">Buy a credit pack to unlock unlimited or capped AI tutor sessions.</p>
            </div>
            <Link href="/payment">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-5 text-xs font-semibold">
                View Plans
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entitlements.map((e) => (
              <div key={e.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
                    <Sparkles className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{productName(e.product_code)}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Full access to AI study helper and course resources</p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">Sessions</span>
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        {e.sessions_remaining === null ? (
                          <>
                            <InfinityIcon className="size-4" /> Unlimited
                          </>
                        ) : (
                          `${e.sessions_remaining} / ${e.sessions_total ?? "?"} left`
                        )}
                      </span>
                    </div>
                    {e.daily_session_cap !== null && (
                      <div className="flex justify-between items-center text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                        <span>Daily limit</span>
                        <span className="font-semibold text-gray-800">{e.daily_session_cap} / day</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                      <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-gray-400" /> Expires</span>
                      <span className="font-semibold text-gray-800">
                        {e.expires_at ? formatDate(e.expires_at) : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Link href="/payment">
                <Button variant="outline" className="border-gray-200 hover:bg-gray-100 rounded-xl h-9 text-xs font-semibold text-gray-700">
                  Buy More Credits
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
