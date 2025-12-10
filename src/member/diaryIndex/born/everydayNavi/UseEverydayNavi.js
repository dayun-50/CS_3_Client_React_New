import { type } from "@testing-library/user-event/dist/type";
import { caxios } from "config/config";
import { useState } from "react";

export function useEverydayNavi() {
    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    ).toISOString().split("T")[0];

    return {
        today,
    }
}