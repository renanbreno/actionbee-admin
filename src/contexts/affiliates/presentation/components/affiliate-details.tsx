"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Phone,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronRight,
  Percent,
} from "lucide-react";
import { Affiliate } from "../../domain/entities/affiliate";
import { formatCPF, formatPhone } from "@/shared/utils/masks";
import { useState } from "react";

interface AffiliateDetailsProps {
  affiliate: Affiliate;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  inline?: boolean;
}

export function AffiliateDetails({
  affiliate,
  isCollapsible = false,
  defaultOpen = true,
  inline = false,
}: AffiliateDetailsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const content = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate">{affiliate.name}</h3>
            <p className="text-muted-foreground text-sm truncate">{affiliate.email}</p>
          </div>
        </div>
        <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-bold text-sm gap-1.5 shrink-0">
          <Percent className="h-3.5 w-3.5" />
          {affiliate.commissionRate}%
        </Badge>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 pt-4 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Contato
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {affiliate.phone && (
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{formatPhone(affiliate.phone)}</span>
            </div>
          )}
          {affiliate.cpf && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground font-medium w-12 shrink-0">CPF:</span>
              <span className="font-mono truncate">{formatCPF(affiliate.cpf)}</span>
            </div>
          )}
          {!affiliate.phone && !affiliate.cpf && (
            <p className="text-muted-foreground text-xs italic">
              Nenhuma informação de contato adicional
            </p>
          )}
        </div>
      </div>

      {/* Social Media */}
      {affiliate.socialMedia && affiliate.socialMedia.length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Redes Sociais
          </h4>
          <div className="flex flex-col gap-2">
            {affiliate.socialMedia.map((social, idx) => (
              <a
                key={idx}
                href={social}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors min-w-0"
                title={social}
              >
                <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="break-all">{social}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>Cadastrado em {new Date(affiliate.createdAt).toLocaleDateString("pt-BR")}</span>
      </div>
    </>
  );

  if (isCollapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 hover:bg-bee-gold/5"
          >
            <span className="font-medium">Ver detalhes do afiliado</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4">{content}</CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (inline) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card>
      <CardContent className="space-y-4">{content}</CardContent>
    </Card>
  );
}
