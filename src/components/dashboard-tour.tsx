"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export function DashboardTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("retallio-tour-completed")
    
    if (!hasSeenTour) {
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          showButtons: ["next", "previous", "close"],
          animate: true,
          smoothScroll: true,
          // KEY FIX: Override default styles in config
          popoverClass: "retallio-tour-popover",
          overlayOpacity: 0.7,
          steps: [
            {
              element: '[data-tour="dashboard"]',
              popover: {
                title: "Welcome to Retallio! 👋",
                description: "Let's take a quick 30-second tour to show you how to manage your retainer clients. Click Next to continue.",
                side: "right",
              },
            },
            {
              element: '[data-tour="dashboard"]',  // ← ADD THIS STEP
              popover: {
                title: "Dashboard",
                description: "See hours used, revenue, and client status at a glance. This is your command center.",
                side: "right",
              },
            },
            {
              element: '[data-tour="clients"]',
              popover: {
                title: "Clients",
                description: "Manage your retainer clients. Add clients, set monthly hours, and track their usage.",
                side: "right",
              },
            },
            {
              element: '[data-tour="time"]',
              popover: {
                title: "Time Tracking",
                description: "Track time against each client. Start a timer or log hours manually.",
                side: "right",
              },
            },
            {
              element: '[data-tour="invoices"]',
              popover: {
                title: "Invoices",
                description: "View and manage invoices. They auto-generate on each client's billing day.",
                side: "right",
              },
            },
            {
              element: '[data-tour="analytics"]',
              popover: {
                title: "Analytics",
                description: "See which clients use the most hours, revenue trends, and more.",
                side: "right",
              },
            },
            {
              element: '[data-tour="settings"]',
              popover: {
                title: "Settings",
                description: "Update your profile, manage subscription, and set notification preferences.",
                side: "right",
              },
            },
            {
              element: '[data-tour="settings"]',
              popover: {
                title: "You're all set! 🎉",
                description: "Start by adding your first retainer client, then track some time. You can restart this tour anytime from Settings.",
                side: "right",
              },
            },
          ],
          onDestroyed: () => {
            localStorage.setItem("retallio-tour-completed", "true")
          },
        })

        driverObj.drive()
      }, 800)
    }
  }, [])

  return null
}

export function restartTour() {
  localStorage.removeItem("retallio-tour-completed")
  window.location.href = "/dashboard"
}