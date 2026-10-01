import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import SeeNext from "@/components/case-study/SeeNext";
import MlsCaseStudy from "@/components/case-study/system/MlsCaseStudy";
import { getMdxComponents } from "@/components/case-study/mdx-components";
import { getAllCaseStudies, getCaseStudy } from "@/lib/case-studies";

export const dynamicParams = false;

interface CaseStudyPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCaseStudies().map((caseStudy) => ({
    slug: caseStudy.frontmatter.slug,
  }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const { frontmatter } = getCaseStudy(params.slug);

  return {
    title: `${frontmatter.title} | Alejandro Villalobos`,
    description: frontmatter.summary || frontmatter.title,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary || frontmatter.title,
      images: frontmatter.cover ? [{ url: frontmatter.cover }] : undefined,
    },
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  if (params.slug === "mlstoolbox") {
    return <MlsCaseStudy />;
  }

  const { frontmatter, content, sections, nextSlug } = getCaseStudy(params.slug);
  const nextCaseStudy = nextSlug ? getCaseStudy(nextSlug) : undefined;

  return (
    <CaseStudyLayout sections={sections}>
      <CaseStudyHero frontmatter={frontmatter} />
      <article className="flex flex-col gap-scale">
        <MDXRemote
          source={content}
          components={getMdxComponents({
            transferSeeNextId: nextCaseStudy !== undefined,
            sections,
          })}
        />
        {nextCaseStudy ? (
          <SeeNext caseStudy={nextCaseStudy.frontmatter} />
        ) : null}
      </article>
    </CaseStudyLayout>
  );
}
