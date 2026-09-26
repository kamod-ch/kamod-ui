import { Field, FieldDescription, FieldLabel } from "@kamod-ch/ui";
import type { TagInputTag } from "@kamod-ch/ui/tag-input";
import { TagInput } from "@kamod-ch/ui/tag-input";
import { useState } from "preact/hooks";

export const KeywordsTagInputDemo = () => {
  const [tags, setTags] = useState<TagInputTag[]>([
    { id: "k1", value: "accessibility" },
    { id: "k2", value: "design-system" },
  ]);

  return (
    <Field class="max-w-lg">
      <FieldLabel htmlFor="keywords">Keywords</FieldLabel>
      <FieldDescription>
        Press Enter to add a tag. Commas are not separators unless configured. Paste multiple lines
        to bulk-add.
      </FieldDescription>
      <TagInput
        id="keywords"
        value={tags}
        onValueChange={setTags}
        separators={["Enter"]}
        enablePasteSplit
        validation={{ maxTags: 8, maxTagLength: 32 }}
        labels={{
          inputPlaceholder: "Add keyword…",
          removeTag: (tag: TagInputTag) => `Remove keyword ${tag.value}`,
        }}
      />
    </Field>
  );
};
