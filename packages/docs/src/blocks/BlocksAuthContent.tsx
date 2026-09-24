/** Login/Signup details share Sidebar's showcase without altering form or standalone-preview behavior. */
import { loginBlocks } from "../../../blocks/src/login/registry";
import { signupBlocks } from "../../../blocks/src/signup/registry";
import { BlockDetailPage } from "./BlockDetailPage";
import { BlockShowcase } from "./BlockShowcase";

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
  return (
    <BlockDetailPage category={category}>
      {block ? (
        <BlockShowcase
          key={block.id}
          block={block}
          loadSource={async (file) =>
            (await import("./auth-source")).getAuthBlockSource(block.id, file)
          }
        />
      ) : (
        <p>Block not found.</p>
      )}
    </BlockDetailPage>
  );
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
