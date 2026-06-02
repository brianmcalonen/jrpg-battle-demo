type FighterSpriteProps = {
  variant: "hero" | "slime" | "rat";
};

export function FighterSprite({ variant }: FighterSpriteProps) {
  return (
    <div className={`sprite sprite-${variant}`} aria-label={`${variant} sprite`}>
      <div className="sprite-shadow" />

      {variant === "hero" && (
        <div className="hero-sprite">
          <div className="hero-head" />
          <div className="hero-hair" />
          <div className="hero-body" />
          <div className="hero-arm hero-arm-left" />
          <div className="hero-arm hero-arm-right" />
          <div className="hero-leg hero-leg-left" />
          <div className="hero-leg hero-leg-right" />
          <div className="hero-sword" />
        </div>
      )}

      {variant === "slime" && (
        <div className="slime-sprite">
          <div className="slime-body" />
          <div className="slime-highlight" />
          <div className="slime-eye slime-eye-left" />
          <div className="slime-eye slime-eye-right" />
        </div>
      )}

      {variant === "rat" && (
        <div className="rat-sprite">
          <div className="rat-tail" />
          <div className="rat-body" />
          <div className="rat-head" />
          <div className="rat-ear rat-ear-left" />
          <div className="rat-ear rat-ear-right" />
          <div className="rat-eye" />
        </div>
      )}
    </div>
  );
}