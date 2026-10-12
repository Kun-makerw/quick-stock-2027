import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Monitor, Laptop, Tablet, Smartphone, Headphones, HardDrive, Printer, Mouse, Keyboard, Cpu, Package, Link2, Tv, Video, Network } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getItemIcon(name: string, tag: string, type: string) {
  const combined = `${name} ${tag} ${type}`.toLowerCase();
  if (combined.includes('desktop') || combined.includes('pc') || combined.includes('computer')) return Monitor;
  if (combined.includes('laptop') || combined.includes('macbook') || combined.includes('chromebook')) return Laptop;
  if (combined.includes('tablet') || combined.includes('ipad')) return Tablet;
  if (combined.includes('phone') || combined.includes('mobile')) return Smartphone;
  if (combined.includes('headphone') || combined.includes('audio') || combined.includes('speaker') || combined.includes('sound')) return Headphones;
  if (combined.includes('drive') || combined.includes('storage') || combined.includes('disk') ) return HardDrive;
  if (combined.includes('print')) return Printer;
  if (combined.includes('mouse') || combined.includes('mice')) return Mouse;
  if (combined.includes('keyboard')) return Keyboard;
  if (combined.includes('cpu') || combined.includes('processor')) return Cpu;
  if (combined.includes('cable') || combined.includes('adapter') || combined.includes('charger') || combined.includes('power')) return Link2;
  if (combined.includes('tv') || combined.includes('display') || combined.includes('screen') || combined.includes('interactive') || combined.includes('projector')) return Tv;
  if (combined.includes('camera') || combined.includes('video') || combined.includes('webcam')) return Video;
  if (combined.includes('network') || combined.includes('router') || combined.includes('switch') || combined.includes('wifi')) return Network;
  return Package;
}
