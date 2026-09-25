/** Login/Signup details share Sidebar's showcase without altering form or standalone-preview behavior. */
import { loginBlocks } from "../../../blocks/src/login/registry";
import { signupBlocks } from "../../../blocks/src/signup/registry";
import { BlockVariantDetail, type VariantSourceLoader } from "./BlockVariantDetail";

const loadSource: VariantSourceLoader<
  (typeof loginBlocks)[number]["id"] | (typeof signupBlocks)[number]["id"]
> = async (blockId, file) => (await import("./auth-source")).getAuthBlockSource(blockId, file);

type AuthCategory = "login" | "signup";

export const BlocksAuthDetailContent = ({
  category,
  blockId,
}: {
  category: AuthCategory;
  blockId?: string;
}) => {
  const blocks = category === "signup" ? signupBlocks : loginBlocks;
  const block = blocks.find((item) => item.id === blockId);
  return <BlockVariantDetail category={category} block={block} loadSource={loadSource} />;
};

export const AuthBlocksPreviewContent = ({
  category,
  id,
}: {
  category?: AuthCategory;
  id?: string;
}) => {
  const blocks = category === "signup" ? signupBlocks : loginBlocks;
  const block = blocks.find((item) => item.id === id) ?? blocks[0];
  const Preview = block.component;
  return (
    <div class="min-h-svh bg-background text-foreground">
      <Preview />
    </div>
  );
};
