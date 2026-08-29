import { previewSavedCards } from "../shared/fixtures";
import { SavedCardsList } from "./saved-cards-list";

export const SavedCardsListPreview = () => (
  <div class="p-4">
    <SavedCardsList cards={previewSavedCards} />
  </div>
);
