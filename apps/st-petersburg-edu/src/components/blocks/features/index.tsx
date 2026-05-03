"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"
import {
  Building2,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import { motion } from "framer-motion"

import { SectionHeading } from "@/src/components/blocks/section-heading"
import { cardReveal, staggerContainer, viewportOnce } from "@/src/lib/motion"

const features = [
  {
    title: "百年底蕴，文凭认可清晰",
    description:
      "始建于 1809 年，俄罗斯交通领域代表性高校。学位受中国教育部认可，未来做留服认证路径明确。",
    icon: Building2,
  },
  {
    title: "预算友好，家庭压力更小",
    description:
      "本硕学费约 2 万+/年，校内宿舍约 80-250 元/月，对比欧美主流方案更容易被普通家庭接受。",
    icon: Wallet,
  },
  {
    title: "预科住学一体，过渡更顺滑",
    description:
      "俄语国际预科中心贴近住宿场景，降低通勤与适应成本，对零基础学生更友好。",
    icon: MapPin,
  },
  {
    title: "管理类方向，毕业压力友好",
    description:
      "课程更强调案例与实践，不是纯硬核工科路线，适合希望稳妥完成学历提升的学生。",
    icon: GraduationCap,
  },
  {
    title: "城市资源成熟，生活体验更平衡",
    description:
      "圣彼得堡兼具文化氛围、生活便利度与相对可控的成本，适合作为留学第一站。",
    icon: ShieldCheck,
  },
  {
    title: "服务链路完整，减少踩坑成本",
    description:
      "从申请、签证到落地接机与入学注册，流程集中管理，更适合第一次做海外升学决策的家庭。",
    icon: Landmark,
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <SectionHeading
            badge="核心优势"
            title="这不是廉价留学，而是更聪明的路径选择"
            description="不是一味强调便宜，而是把预算、学历认可、生活适应与毕业难度放到同一个框架里综合评估。"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardReveal}>
              <Card className="group h-full overflow-hidden border border-border/20 bg-card/80 shadow-[0_20px_60px_-42px_rgba(39,54,112,0.45)] backdrop-blur transition-all hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_26px_80px_-40px_rgba(70,84,255,0.35)]">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(80,95,255,0.18),rgba(255,192,88,0.22))] transition-transform duration-300 group-hover:scale-105">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl leading-8">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4 }}
            className="rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(135deg,rgba(87,100,255,0.1),rgba(255,204,103,0.12))] p-6 sm:p-8"
          >
            <p className="text-sm font-medium text-primary">成本结构更友好</p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-4 grid gap-4 sm:grid-cols-3"
            >
              <motion.div
                variants={cardReveal}
                className="rounded-2xl bg-background/80 p-4"
              >
                <p className="text-2xl font-semibold text-foreground">2 万+</p>
                <p className="mt-1 text-sm text-muted-foreground">年学费区间</p>
              </motion.div>
              <motion.div
                variants={cardReveal}
                className="rounded-2xl bg-background/80 p-4"
              >
                <p className="text-2xl font-semibold text-foreground">80-250</p>
                <p className="mt-1 text-sm text-muted-foreground">宿舍月费用</p>
              </motion.div>
              <motion.div
                variants={cardReveal}
                className="rounded-2xl bg-background/80 p-4"
              >
                <p className="text-2xl font-semibold text-foreground">5-6 万</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  年总预算参考
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4 }}
            className="rounded-[1.75rem] border border-border/20 bg-card/80 p-6 sm:p-8"
          >
            <p className="text-sm font-medium text-primary">产品定位</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              面向“预算敏感但目标明确”的留学人群
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              如果你的诉求是名校情结、可认证学历、总体预算可控、毕业路径更稳，这个项目就有明确的产品匹配度。
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
