import React, { useState } from 'react';
import { ChevronLogo, ActionSilhouetteLogo, MedalLogo, LogoVariant } from './';

const LogoShowcase: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>('danger');
  const [selectedSize, setSelectedSize] = useState(64);

  const variants: { key: LogoVariant; label: string; description: string }[] = [
    { 
      key: 'danger', 
      label: 'Danger (Principal)', 
      description: 'Rouge crimson pour l\'identité principale' 
    },
    { 
      key: 'steel', 
      label: 'Steel (Neutre)', 
      description: 'Gris acier pour les usages secondaires' 
    },
    { 
      key: 'highlight', 
      label: 'Highlight (Texte)', 
      description: 'Blanc chaud pour contraste maximum' 
    },
  ];

  const sizes = [32, 48, 64, 96, 128];

  const logos = [
    {
      component: ChevronLogo,
      name: 'Chevron Stylisé',
      description: 'Style stencil avec gradients de rang militaire. Évoque discipline et hiérarchie.',
      features: ['Iconographie chevron', 'Effet stencil', 'Texture métallique', 'Gradients de rang']
    },
    {
      component: ActionSilhouetteLogo,
      name: 'Silhouette en Action',
      description: 'Athlète en mouvement avec éclairage contre-jour. Dynamisme et performance.',
      features: ['Mouvement dynamique', 'Contre-jour', 'Lignes de force', 'Anonymat visuel']
    },
    {
      component: MedalLogo,
      name: 'Médaille Minimaliste',
      description: 'Médaille militaire épurée avec chevrons de discipline. Accomplissement et honneur.',
      features: ['Design minimaliste', 'Chevrons disciplinaires', 'Effet métallique', 'Gravures subtiles']
    }
  ];

  return (
    <div className="p-8 bg-martial-primary-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-display font-black text-martial-highlight mb-4">
            Propositions de Logo
          </h1>
          <p className="text-lg text-martial-steel max-w-2xl mx-auto">
            Trois concepts d'identité visuelle pour l'application de calisthénie, 
            alliant ambiance martiale et modernité.
          </p>
        </header>

        {/* Contrôles */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 p-6 bg-martial-surface-1 rounded-lg border border-martial-steel/20">
          <div className="flex-1">
            <h3 className="text-martial-highlight font-display font-semibold mb-3">
              Variante de couleur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {variants.map((variant) => (
                <button
                  key={variant.key}
                  onClick={() => setSelectedVariant(variant.key)}
                  className={`p-3 rounded-md border-2 transition-all text-left ${
                    selectedVariant === variant.key
                      ? 'border-martial-danger-accent bg-martial-danger-accent/10'
                      : 'border-martial-steel/30 hover:border-martial-steel/50'
                  }`}
                >
                  <div className="font-semibold text-martial-highlight text-sm">
                    {variant.label}
                  </div>
                  <div className="text-xs text-martial-steel mt-1">
                    {variant.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-48">
            <h3 className="text-martial-highlight font-display font-semibold mb-3">
              Taille
            </h3>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="w-full martial-input"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille des logos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {logos.map((logo, index) => {
            const LogoComponent = logo.component;
            return (
              <div
                key={index}
                className="martial-card p-8 text-center"
              >
                {/* Logo Display */}
                <div className="flex justify-center mb-6 p-8 bg-martial-surface-hover rounded-lg">
                  <LogoComponent
                    size={selectedSize}
                    variant={selectedVariant}
                    className="drop-shadow-lg"
                  />
                </div>

                {/* Info */}
                <h3 className="text-xl font-display font-bold text-martial-highlight mb-3">
                  {logo.name}
                </h3>
                
                <p className="text-martial-steel mb-6 text-sm leading-relaxed">
                  {logo.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-martial-highlight uppercase tracking-wide">
                    Caractéristiques
                  </h4>
                  <ul className="space-y-1">
                    {logo.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className="text-xs text-martial-steel flex items-center"
                      >
                        <div className="martial-chevron martial-chevron-steel mr-2 w-2 h-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Usage Examples */}
                <div className="mt-6 pt-4 border-t border-martial-steel/20">
                  <h4 className="text-xs font-semibold text-martial-steel uppercase tracking-wide mb-3">
                    Aperçu des tailles
                  </h4>
                  <div className="flex justify-center items-center gap-4">
                    <LogoComponent size={24} variant={selectedVariant} />
                    <LogoComponent size={32} variant={selectedVariant} />
                    <LogoComponent size={48} variant={selectedVariant} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Guidelines */}
        <div className="mt-12 p-6 bg-martial-surface-1 rounded-lg border border-martial-steel/20">
          <h3 className="text-xl font-display font-bold text-martial-highlight mb-4">
            Directives d'Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-martial-highlight mb-2">Recommandations</h4>
              <ul className="space-y-1 text-martial-steel">
                <li>• Utiliser la variante Danger pour l'identité principale</li>
                <li>• Steel pour les usages secondaires et interfaces</li>
                <li>• Highlight sur fonds sombres pour maximum de contraste</li>
                <li>• Respecter les tailles minimales (24px mobile, 32px desktop)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-martial-highlight mb-2">Applications</h4>
              <ul className="space-y-1 text-martial-steel">
                <li>• Headers de navigation (32-48px)</li>
                <li>• Favicons et app icons (16-256px)</li>
                <li>• Splash screens et loading (96-128px)</li>
                <li>• Print et marketing (vectoriel SVG)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
