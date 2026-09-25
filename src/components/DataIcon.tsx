// Ícone de um serviço ou categoria, a partir do nome guardado nos dados
// (nomes do lucide-react em kebab-case). Importados um a um para o pacote
// final levar só o que é usado.

import {
  Accessibility,
  Ambulance,
  Baby,
  Brain,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Hospital,
  IdCard,
  Landmark,
  MapPin,
  MessageCircleHeart,
  Phone,
  Scale,
  Shield,
  ShieldCheck,
  ShieldHalf,
  Siren,
  Stethoscope,
  TestTube,
  Users,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import { createElement } from 'react';

const ICONES: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  ambulance: Ambulance,
  baby: Baby,
  brain: Brain,
  'graduation-cap': GraduationCap,
  'hand-heart': HandHeart,
  'heart-pulse': HeartPulse,
  home: Home,
  hospital: Hospital,
  'id-card': IdCard,
  landmark: Landmark,
  'message-circle-heart': MessageCircleHeart,
  phone: Phone,
  scale: Scale,
  shield: Shield,
  'shield-check': ShieldCheck,
  'shield-half': ShieldHalf,
  siren: Siren,
  stethoscope: Stethoscope,
  'test-tube': TestTube,
  users: Users,
};

interface DataIconProps extends LucideProps {
  /** Nome do ícone no JSON; se for desconhecido, usa um marcador de local. */
  nome: string;
}

function DataIcon({ nome, ...props }: DataIconProps) {
  return createElement(ICONES[nome] ?? MapPin, props);
}

export default DataIcon;
