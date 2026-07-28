"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCard() {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">Current Plan</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Manage your active subscription tiers and billing information.
            </CardDescription>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
                <Sparkles className="size-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">AI Tutor Unlimited Monthly</h4>
                <p className="text-xs text-gray-500 mt-0.5">Full access to AI study helper and course resources</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Unlimited sessions with personal AI tutor</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Access to all standard past GCE papers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>24/7 priority support & analytics dashboard</span>
              </div>
            </div>
          </div>

          {/* Pricing & Billing Details */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-500">Price</span>
                <span className="text-lg font-extrabold text-gray-900">15,000 XAF<span className="text-xs font-normal text-gray-400">/mo</span></span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-600 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-gray-400" /> Next Renewal</span>
                <span className="font-semibold text-gray-800">August 28, 2026</span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="flex items-center gap-1.5"><CreditCard className="size-3.5 text-gray-400" /> Payment Method</span>
                <span className="font-semibold text-gray-800">Orange Money (+237 699 *** *32)</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 mt-2 border-t border-gray-200/60">
              <Link href="/payment" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 text-xs font-semibold transition-colors">
                  Upgrade Plan
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 border-gray-200 hover:bg-gray-100 rounded-xl h-9 text-xs font-semibold text-gray-700">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
