"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import {
  BedDouble,
  BookOpenCheck,
  CircleCheckBig,
  HandCoins,
  School,
  ShieldEllipsis,
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

const majorReasons = [
  {
    title: "课程更偏实践",
    description:
      "以案例分析和项目实操为主，不是单纯死记硬背，学习压力更容易被管理。",
    icon: BookOpenCheck,
  },
  {
    title: "考核方式更友好",
    description:
      "更重视平时表现、小组作业和过程性评估，降低单次期末考试带来的高压。",
    icon: CircleCheckBig,
  },
  {
    title: "适合目标明确型学生",
    description:
      "如果你的目标是顺利完成学历提升，而不是挑战最难专业，这类方向更匹配。",
    icon: School,
  },
]

const dormitoryItems = [
  "标准 2-3 人间，空间相对友好",
  "公共厨房、自习室等配套较完整",
  "暖气供应与基础安保更让家长安心",
  "住学距离近，减少通勤与适应成本",
]

const servicePromises = [
  {
    title: "全流程协助",
    description:
      "从申请前咨询到入学后衔接，尽量不让学生和家长单独面对复杂流程。",
    icon: ShieldEllipsis,
  },
  {
    title: "收费透明",
    description: "强调一次性明确收费范围，避免靠后期隐形加项来制造不确定性。",
    icon: HandCoins,
  },
]

export function MajorService() {
  return (
    <section id="major-service" className="scroll-mt-24 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <SectionHeading
            badge="专业与服务保障"
            title="把“好毕业、住得稳、服务透明”这三件事单独讲清楚"
            description="这部分是从 PPT 到网站最容易漏掉的内容，但它对家长决策和学生真实选择反而非常关键。"
          />
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-6">
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              whileHover={{ y: -4 }}
            >
              <Card className="border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <School className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-2xl">
                    为什么管理学方向更容易被接受
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="grid gap-4 sm:grid-cols-3"
                  >
                    {majorReasons.map((item) => (
                      <motion.div
                        key={item.title}
                        variants={cardReveal}
                        whileHover={{ y: -4 }}
                        className="rounded-3xl border border-border/20 bg-background/80 p-5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              whileHover={{ y: -4 }}
            >
              <Card className="border border-border/20 bg-[linear-gradient(135deg,rgba(79,94,255,0.07),rgba(255,200,97,0.1))] shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-primary">
                    <BedDouble className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-4 text-2xl">
                    住宿与校园生活细节
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-5 grid gap-4 sm:grid-cols-2"
                  >
                    <motion.div
                      variants={cardReveal}
                      whileHover={{ y: -4 }}
                      className="relative h-44 overflow-hidden rounded-[1.4rem] border border-border/20"
                    >
                      <Image
                        src="/assets/image31.jpeg"
                        alt="学生宿舍外景"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </motion.div>
                    <motion.div
                      variants={cardReveal}
                      whileHover={{ y: -4 }}
                      className="relative h-44 overflow-hidden rounded-[1.4rem] border border-border/20"
                    >
                      <Image
                        src="/assets/image20.jpeg"
                        alt="课堂与学生场景"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {dormitoryItems.map((item) => (
                      <motion.div
                        key={item}
                        variants={cardReveal}
                        className="rounded-2xl border border-border/20 bg-background/82 px-4 py-3 text-sm text-foreground"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            whileHover={{ y: -6 }}
          >
            <Card className="border border-border/20 bg-card/80 shadow-[0_18px_70px_-48px_rgba(31,39,90,0.35)]">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground">
                  <ShieldEllipsis className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4 text-2xl">
                  服务保障与收费承诺
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-8 text-muted-foreground">
                  对多数家庭来说，真正担心的不是“学校能不能申请”，而是流程会不会失控、生活能不能接住、后续会不会不断加价。网站必须把这些问题说透。
                </p>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className="grid gap-4"
                >
                  {servicePromises.map((item) => (
                    <motion.div
                      key={item.title}
                      variants={cardReveal}
                      whileHover={{ y: -4 }}
                      className="rounded-[1.5rem] border border-border/20 bg-background/80 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={cardReveal}
                  className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(70,86,255,0.92),rgba(110,203,255,0.74))] p-6 text-white"
                >
                  <p className="text-sm tracking-[0.2em] text-white/72 uppercase">
                    透明承诺
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    拒绝隐形消费，把关键节点提前说清
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/82">
                    对家长而言，透明感本身就是信任的一部分。把服务范围、收费逻辑和时间节点讲清楚，比单纯强调“包办”更有说服力。
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
