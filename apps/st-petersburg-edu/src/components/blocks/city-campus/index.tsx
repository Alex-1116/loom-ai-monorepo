"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import {
  Building2,
  Castle,
  Landmark,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@loom/ui/components/card"

import { SectionHeading } from "@/src/components/blocks/section-heading"
import {
  cardReveal,
  sectionReveal,
  staggerContainer,
  viewportOnce,
} from "@/src/lib/motion"

const cityHighlights = [
  {
    title: "文化艺术之都",
    description:
      "冬宫、夏宫、白夜节共同构成圣彼得堡的城市气质，让留学不仅是学历提升，也是一段真正有记忆点的海外生活。",
    icon: Castle,
  },
  {
    title: "安全感更强",
    description:
      "作为俄罗斯相对更安全、秩序更成熟的留学城市之一，更适合作为第一次出国读书的起点。",
    icon: ShieldCheck,
  },
  {
    title: "生活成本更平衡",
    description:
      "相较莫斯科，整体生活成本通常更低，预算规划更容易控制，不容易在生活支出上失控。",
    icon: Wallet,
  },
  {
    title: "华人环境成熟",
    description:
      "华人社区、基础生活配套和日常互助氛围较成熟，初到异国也不会完全失去支持系统。",
    icon: Users,
  },
]

const campusPoints = [
  "城市资源密集，学习之外也有充分的文化体验",
  "学校位于圣彼得堡，长期形成国际生适应环境",
  "周边生活便利，适合学生快速建立留学节奏",
  "整体氛围比高压型留学路线更平衡、更务实",
]

export function CityCampus() {
  return (
    <section id="city-campus" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionHeading
            badge="城市与校园"
            title="为什么很多学生，会先被圣彼得堡这座城市打动"
            description="圣彼得堡的价值不只是“俄罗斯第二大城市”，更在于它兼具文化感、安全感、留学成本控制力和更成熟的留学生生活环境。"
          />
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            whileHover={{ y: -6 }}
            className="overflow-hidden rounded-[2rem] border border-border/20 bg-card/80 shadow-[0_24px_80px_-46px_rgba(31,39,90,0.38)] transition-shadow"
          >
            <div className="relative min-h-[420px] p-5 text-white sm:p-8">
              <Image
                src="/assets/image6.jpeg"
                alt="圣彼得堡冬宫"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,28,68,0.75),rgba(41,81,156,0.55),rgba(255,196,90,0.25))]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 backdrop-blur">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-sm tracking-[0.24em] text-white/70 uppercase">
                    St. Petersburg
                  </p>
                  <h3 className="mt-4 max-w-lg text-3xl leading-tight font-semibold sm:text-4xl">
                    北方威尼斯，不只是宣传词，而是留学体验的一部分
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-8 text-white/82">
                    这里既有世界级城市的文化感，又保留了更适合学生落地生活的秩序和成本结构，是一个非常适合做留学第一站的地方。
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold">20%-30%</p>
                    <p className="mt-1 text-sm text-white/76">
                      生活成本通常低于莫斯科
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold">白夜节</p>
                    <p className="mt-1 text-sm text-white/76">
                      城市记忆点与文化识别度极强
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                variants={cardReveal}
                whileHover={{ y: -4 }}
                className="relative h-44 overflow-hidden rounded-[1.6rem] border border-border/20 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]"
              >
                <Image
                  src="/assets/image1.jpeg"
                  alt="圣彼得堡河景"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </motion.div>
              <motion.div
                variants={cardReveal}
                whileHover={{ y: -4 }}
                className="relative h-44 overflow-hidden rounded-[1.6rem] border border-border/20 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]"
              >
                <Image
                  src="/assets/image12.jpeg"
                  alt="圣彼得堡国立交通大学建筑"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {cityHighlights.map((item) => (
                <motion.div
                  key={item.title}
                  variants={cardReveal}
                  whileHover={{ y: -6 }}
                >
                  <Card
                    key={item.title}
                    className="h-full border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]"
                  >
                    <CardHeader>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="pt-4 text-xl">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={cardReveal} whileHover={{ y: -4 }}>
              <Card className="border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-2xl">
                    城市环境对留学生意味着什么
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {campusPoints.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/20 bg-background/75 px-4 py-3 text-sm text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
