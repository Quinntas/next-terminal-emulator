"use client"

import Layout from "@/components/main-layout";
import React from "react";

export default function () {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onClickAnywhere = () => {
        inputRef.current?.focus();
    };

    return <Layout onClick={onClickAnywhere}>
    </Layout>
}