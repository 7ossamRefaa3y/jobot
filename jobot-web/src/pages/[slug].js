import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageHistory from "@/components/MessageHistory";
import MessageInput from "@/components/MessageInput";
import SkillForm from "@/components/SkillForm";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function SkillPage({ skill }) {
  const { history, sending, sendMessages } = useOpenAIMessages();

  if (!skill) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{skill.title} - Jobot</title>
        <meta name="description" content={skill.description} />
        <link rel="icon" href="/jobot_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />

        {history.length === 1 && (
          <SkillForm skill={skill} sendMessages={sendMessages} />
        )}

        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sending={sending} sendMessages={sendMessages} />
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const supabase = createServerSupabaseClient(context);
  const slug = context.params.slug;

  const { data: skill, error } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to fetch skill for slug: " + slug, error);
    return {
      notFound: true,
    };
  }

  return {
    props: { skill },
  };
}
