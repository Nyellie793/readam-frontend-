"use client";

import { useEffect, useState } from "react";

import { getDashboard } from "@/services/dashboard.service";

export default function useDashboard(){

    const [dashboard,setDashboard] = useState();

    const [loading,setLoading] = useState(true);

    useEffect(()=>{

        async function load(){

            const data = await getDashboard();

            setDashboard(data);

            setLoading(false);

        }

        load();

    },[]);

    return {

        dashboard,

        loading

    };

}