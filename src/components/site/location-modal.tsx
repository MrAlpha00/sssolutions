import { MapPin } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/utils";

/**
 * Google Maps location dialog.
 *
 * Uses the keyless `output=embed` URL — no paid Maps API or key required.
 * The iframe is only created when the dialog is opened.
 */
export function LocationModal({
  address,
  label = "View on map",
  title = "Our location",
}: {
  address: string;
  label?: string;
  title?: string;
}) {
  return (
    <Modal
      label={label}
      title={title}
      triggerVariant="secondary"
      triggerSize="sm"
      triggerIcon={<MapPin className="h-4 w-4" />}
      panelClassName="max-w-4xl"
    >
      <div className="aspect-[16/10] w-full bg-sand">
        <iframe
          title={`Map showing ${address}`}
          src={mapsEmbedUrl(address)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{address}</p>
        <ButtonLink
          href={mapsDirectionsUrl(address)}
          external
          size="sm"
          className="shrink-0"
        >
          Get directions
        </ButtonLink>
      </div>
    </Modal>
  );
}
