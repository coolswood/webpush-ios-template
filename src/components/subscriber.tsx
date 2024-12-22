import React, { useEffect, useMemo, useState } from "react"
import { useConfig, clientSettings } from "@magicbell/react-headless"
import { prefetchConfig, registerServiceWorker } from "@magicbell/webpush"

import subscriptionManager from "@/services/subscriptionManager"
import Button from "@/components/button"
import { State } from "@/pages"

const partner = {
  "2606506588496713": "2045794073282663",
  "2045794073282663": "2606506588496713",
};

export default function Subscriber({
  state,
  setState,
}: {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}) {
  const config = useConfig()

  const subscribeOptions = useMemo(() => {
    const host = "https://api.magicbell.com"
    try {
      const url = new URL(config.channels?.webPush.config.subscribeUrl || "")
      return {
        token: url.searchParams.get("access_token") || "",
        project: url.searchParams.get("project") || "",
        host,
      }
    } catch (e) {
      return { token: "", project: "", host }
    }
  }, [config])

  useEffect(() => {
    if (!subscribeOptions.token) {
      return
    }
    registerServiceWorker()
    prefetchConfig(subscribeOptions)
  }, [subscribeOptions])

  /// 2606506588496713 - Данил
  /// 2045794073282663 - Софа

  const handleSubscribe = async () => {
    try {
      setState({ status: "busy" })
      await subscriptionManager.subscribe(
        partner[clientSettings.getState().userExternalId!],
        subscribeOptions
      )
      setState({ status: "success" })
    } catch (error: any) {
      setState({ status: "error", error: error.message })
    }
  }

  const isLoading = !subscribeOptions.token || state.status === "busy"

  if (isLoading) {
    return null;
  }

  if (state.status === "error") {
    return null;
  }

  return (
    <div
    className="fixed bottom-4 right-4 z-50"
        onClick={handleSubscribe}
      >
        <img width={30} height={30} src="/favicon.svg" alt="" />
      </div>
  )
}
