"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  driver,
  type AllowedButtons,
  type Driver,
  type DriveStep,
} from "driver.js";
import { useTranslation } from "react-i18next";

import type { TabId } from "@/types";

const TOUR_SEEN_KEY = "sawahsense-tour-seen";

interface UseAppTourArgs {
  onTabChange: (tab: TabId) => void;
  isMobile: boolean;
  /** Open or close the mobile sidebar overlay so the highlighted element is visible. */
  setSidebarOpen?: (open: boolean) => void;
}

export function useAppTour({
  onTabChange,
  isMobile,
  setSidebarOpen,
}: UseAppTourArgs) {
  const { t } = useTranslation();
  const driverRef = useRef<Driver | null>(null);

  const openSidebar = useCallback(() => {
    if (isMobile) setSidebarOpen?.(true);
  }, [isMobile, setSidebarOpen]);

  const closeSidebar = useCallback(() => {
    if (isMobile) setSidebarOpen?.(false);
  }, [isMobile, setSidebarOpen]);

  const buildSteps = useCallback((): DriveStep[] => {
    // NOTE: do not put `progressText` on per-step popovers. driver.js spreads
    // the user's popover object AFTER its own interpolated `progressText`, so
    // a literal "{{current}} / {{total}}" set per-step overwrites the
    // already-interpolated value and you see raw braces in the UI.
    // Set it once at the driver config level instead.
    const popoverDefaults = {
      showButtons: ["next", "previous", "close"] as AllowedButtons[],
      nextBtnText: t("tour.next"),
      prevBtnText: t("tour.prev"),
      doneBtnText: t("tour.done"),
    };

    return [
      {
        element: '[data-tour="welcome"]',
        onHighlightStarted: () => openSidebar(),
        popover: {
          ...popoverDefaults,
          title: t("tour.welcome.title"),
          description: t("tour.welcome.body"),
          showButtons: ["next", "close"] as AllowedButtons[],
        },
      },
      {
        element: '[data-tour="tab-fields"]',
        onHighlightStarted: () => {
          openSidebar();
          onTabChange("fields");
        },
        popover: {
          ...popoverDefaults,
          title: t("tour.fields.title"),
          description: t("tour.fields.body"),
        },
      },
      {
        element: '[data-tour="tab-alerts"]',
        onHighlightStarted: () => {
          openSidebar();
          onTabChange("alerts");
        },
        popover: {
          ...popoverDefaults,
          title: t("tour.alerts.title"),
          description: t("tour.alerts.body"),
        },
      },
      {
        element: '[data-tour="tab-tasks"]',
        onHighlightStarted: () => {
          openSidebar();
          onTabChange("tasks");
        },
        popover: {
          ...popoverDefaults,
          title: t("tour.tasks.title"),
          description: t("tour.tasks.body"),
        },
      },
      {
        element: '[data-tour="tab-pakTani"]',
        onHighlightStarted: () => {
          openSidebar();
          onTabChange("pakTani");
        },
        popover: {
          ...popoverDefaults,
          title: t("tour.pakTani.title"),
          description: t("tour.pakTani.body"),
        },
      },
      {
        element: '[data-tour="index-legend"]',
        onHighlightStarted: () => closeSidebar(),
        popover: {
          ...popoverDefaults,
          title: t("tour.indices.title"),
          description: t("tour.indices.body"),
          side: "left",
          align: "end",
        },
      },
      {
        element: '[data-tour="lang-toggle"]',
        popover: {
          ...popoverDefaults,
          title: t("tour.language.title"),
          description: t("tour.language.body"),
        },
      },
      {
        element: '[data-tour="tutorial-btn"]',
        popover: {
          ...popoverDefaults,
          title: t("tour.replay.title"),
          description: t("tour.replay.body"),
          doneBtnText: t("tour.finish"),
        },
      },
    ];
  }, [closeSidebar, onTabChange, openSidebar, t]);

  const start = useCallback(() => {
    openSidebar();

    driverRef.current?.destroy();
    const d = driver({
      animate: true,
      smoothScroll: true,
      allowClose: true,
      showProgress: true,
      stagePadding: 6,
      stageRadius: 10,
      overlayOpacity: 0.65,
      popoverClass: "sawahsense-tour",
      progressText: "{{current}} / {{total}}",
      steps: buildSteps(),
      onDestroyed: () => {
        try {
          window.localStorage.setItem(TOUR_SEEN_KEY, "1");
        } catch {
          /* ignore */
        }
      },
    });
    driverRef.current = d;
    d.drive();
  }, [buildSteps, openSidebar]);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = "1";
    try {
      seen = window.localStorage.getItem(TOUR_SEEN_KEY) ?? "";
    } catch {
      return;
    }
    if (seen) return;

    const timer = window.setTimeout(() => start(), 800);
    return () => window.clearTimeout(timer);
  }, [start]);

  return { startTour: start };
}
