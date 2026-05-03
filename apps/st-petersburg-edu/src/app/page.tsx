import { CityCampus } from "@/src/components/blocks/city-campus"
import { CostCertification } from "@/src/components/blocks/cost-certification"
import { Hero } from "@/src/components/blocks/hero"
import { Features } from "@/src/components/blocks/features"
import { FinalCta } from "@/src/components/blocks/final-cta"
import { MajorService } from "@/src/components/blocks/major-service"
import { Process } from "@/src/components/blocks/process"
import { TargetAudience } from "@/src/components/blocks/target-audience"
import { SiteShell } from "@/src/layouts/shell"

export default function Page() {
  return (
    <SiteShell>
      <Hero />
      <CityCampus />
      <Features />
      <CostCertification />
      <MajorService />
      <Process />
      <TargetAudience />
      <FinalCta />
    </SiteShell>
  )
}
