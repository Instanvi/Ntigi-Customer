"use client";

import type { Icon } from "@phosphor-icons/react";
import {
  House,
  MagnifyingGlass,
  User,
  Package,
  MapPin,
  Headset,
  FileText,
  Shield,
  Phone,
  EnvelopeSimple,
  Buildings,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  List,
  CurrencyDollar,
  Money,
  Question,
  Barcode,
  ShareNetwork,
  CaretLeft,
  Airplane,
} from "@phosphor-icons/react";
import type { PortalIconName } from "./types";

const ICON_MAP: Record<PortalIconName, Icon> = {
  House,
  MagnifyingGlass,
  User,
  Package,
  MapPin,
  Headset,
  FileText,
  Shield,
  Phone,
  EnvelopeSimple,
  Buildings,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  List,
  CurrencyDollar,
  Money,
  Question,
  Barcode,
  ShareNetwork,
  CaretLeft,
  Airplane,
};

export function resolvePortalIcon(name: PortalIconName): Icon {
  return ICON_MAP[name] ?? Package;
}
