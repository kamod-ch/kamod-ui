export type PackageFeature = {
  title: string;
  text: string;
};

export type PackageFeatureGridProps = {
  features: PackageFeature[];
};

export const PackageFeatureGrid = ({ features }: PackageFeatureGridProps) =>
  features.length ? (
    <ul class="docs-package-feature-grid">
      {features.map((feature) => (
        <li class="docs-package-feature-card" key={feature.title}>
          <h3 class="docs-package-feature-title">{feature.title}</h3>
          <p class="docs-package-feature-text">{feature.text}</p>
        </li>
      ))}
    </ul>
  ) : null;
