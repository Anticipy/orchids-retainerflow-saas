import { describe, it, expect } from "vitest"
import {
  clientStatusFromPercent,
  shouldNotifyHours80,
  shouldNotifyHours100,
  percentUsed,
} from "./notification-rules"

describe("clientStatusFromPercent", () => {
  it("returns good when under 80%", () => {
    expect(clientStatusFromPercent(0)).toBe("good")
    expect(clientStatusFromPercent(50)).toBe("good")
    expect(clientStatusFromPercent(79)).toBe("good")
  })

  it("returns warning at 80% and above until 100%", () => {
    expect(clientStatusFromPercent(80)).toBe("warning")
    expect(clientStatusFromPercent(90)).toBe("warning")
    expect(clientStatusFromPercent(99)).toBe("warning")
  })

  it("returns exceeded at 100% and above", () => {
    expect(clientStatusFromPercent(100)).toBe("exceeded")
    expect(clientStatusFromPercent(150)).toBe("exceeded")
  })
})

describe("shouldNotifyHours80", () => {
  it("returns false when cap is 0", () => {
    expect(shouldNotifyHours80(10, 0)).toBe(false)
  })

  it("returns true when used is >= 80% and < 100%", () => {
    expect(shouldNotifyHours80(8, 10)).toBe(true)
    expect(shouldNotifyHours80(8.5, 10)).toBe(true)
    expect(shouldNotifyHours80(9.9, 10)).toBe(true)
  })

  it("returns false when under 80%", () => {
    expect(shouldNotifyHours80(7, 10)).toBe(false)
    expect(shouldNotifyHours80(7.9, 10)).toBe(false)
  })

  it("returns false when at or over 100%", () => {
    expect(shouldNotifyHours80(10, 10)).toBe(false)
    expect(shouldNotifyHours80(12, 10)).toBe(false)
  })
})

describe("shouldNotifyHours100", () => {
  it("returns false when cap is 0", () => {
    expect(shouldNotifyHours100(10, 0)).toBe(false)
  })

  it("returns true when used >= 100%", () => {
    expect(shouldNotifyHours100(10, 10)).toBe(true)
    expect(shouldNotifyHours100(12, 10)).toBe(true)
  })

  it("returns false when under 100%", () => {
    expect(shouldNotifyHours100(9, 10)).toBe(false)
    expect(shouldNotifyHours100(9.9, 10)).toBe(false)
  })
})

describe("percentUsed", () => {
  it("returns 0 when cap is 0", () => {
    expect(percentUsed(5, 0)).toBe(0)
  })

  it("returns rounded percent", () => {
    expect(percentUsed(5, 10)).toBe(50)
    expect(percentUsed(8, 10)).toBe(80)
    expect(percentUsed(10, 10)).toBe(100)
    expect(percentUsed(1, 3)).toBe(33)
  })
})

describe("on track / not on track", () => {
  it("good = on track (under 80%)", () => {
    expect(clientStatusFromPercent(79)).toBe("good")
    expect(shouldNotifyHours80(7.9, 10)).toBe(false)
    expect(shouldNotifyHours100(7.9, 10)).toBe(false)
  })

  it("warning = approaching limit (80–99%)", () => {
    expect(clientStatusFromPercent(85)).toBe("warning")
    expect(shouldNotifyHours80(8.5, 10)).toBe(true)
    expect(shouldNotifyHours100(8.5, 10)).toBe(false)
  })

  it("exceeded = not on track (100%+)", () => {
    expect(clientStatusFromPercent(100)).toBe("exceeded")
    expect(clientStatusFromPercent(120)).toBe("exceeded")
    expect(shouldNotifyHours80(10, 10)).toBe(false)
    expect(shouldNotifyHours100(10, 10)).toBe(true)
  })
})
