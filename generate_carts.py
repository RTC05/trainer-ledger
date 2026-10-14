"""Generate authentic-looking Pokémon cartridge SVGs into static/carts/.

Each platform gets its correct physical shape.  Labels mimic the real
game art with accurate colors and simplified Pokémon silhouettes.

Run: python generate_carts.py
"""
from pathlib import Path

OUT = Path("static/carts")
OUT.mkdir(parents=True, exist_ok=True)

# viewBox is always "0 0 64 96" so all carts are the same display size.
# ─── Pokémon silhouettes (simplified SVG paths, centered ~32,38 area) ─────────

SIL = {
    # Gen 1
    "charizard": """
      <!-- Charizard: orange dragon with wings -->
      <ellipse cx="32" cy="50" rx="8" ry="10" fill="#FF8C00"/>
      <polygon points="32,42 24,30 30,44" fill="#FF8C00"/>
      <polygon points="32,42 40,30 34,44" fill="#FF8C00"/>
      <ellipse cx="32" cy="40" rx="5" ry="5" fill="#FF8C00"/>
      <polygon points="32,36 29,30 35,30" fill="#FF8C00"/>
      <polygon points="38,52 46,58 40,54" fill="#FF8C00"/>
      <circle cx="46" cy="58" r="3" fill="#FF4500"/>
      <circle cx="46" cy="58" r="1.5" fill="#FF0" opacity="0.8"/>
    """,
    "blastoise": """
      <!-- Blastoise: blue turtle with cannons -->
      <ellipse cx="32" cy="50" rx="10" ry="9" fill="#1A6BBF"/>
      <ellipse cx="32" cy="49" rx="8" ry="8" fill="#2288EE"/>
      <ellipse cx="32" cy="40" rx="5" ry="4" fill="#1A6BBF"/>
      <rect x="22" y="43" width="5" height="8" rx="2" fill="#0D4A8A"/>
      <rect x="37" y="43" width="5" height="8" rx="2" fill="#0D4A8A"/>
      <rect x="20" y="40" width="5" height="4" rx="1" fill="#888"/>
      <rect x="39" y="40" width="5" height="4" rx="1" fill="#888"/>
    """,
    "pikachu": """
      <!-- Pikachu: yellow mouse -->
      <ellipse cx="32" cy="50" rx="9" ry="10" fill="#F5C518"/>
      <ellipse cx="32" cy="41" rx="6" ry="5" fill="#F5C518"/>
      <polygon points="26,38 24,28 30,36" fill="#F5C518"/>
      <polygon points="24,29 22,26 28,35" fill="#1a1a1a"/>
      <polygon points="38,38 40,28 34,36" fill="#F5C518"/>
      <polygon points="40,29 42,26 36,35" fill="#1a1a1a"/>
      <circle cx="28" cy="50" r="2.5" fill="#FF4444" opacity="0.9"/>
      <circle cx="36" cy="50" r="2.5" fill="#FF4444" opacity="0.9"/>
      <polyline points="40,52 45,48 48,55 44,58" fill="#F5C518" stroke="#F5C518" stroke-width="2"/>
    """,
    # Gen 2
    "ho-oh": """
      <!-- Ho-Oh: large bird with spread wings -->
      <polygon points="32,38 14,52 32,58 50,52" fill="#EE1111"/>
      <polygon points="32,38 14,52 20,46" fill="#FFD700"/>
      <polygon points="32,38 50,52 44,46" fill="#FFD700"/>
      <ellipse cx="32" cy="40" rx="5" ry="5" fill="#EE1111"/>
      <ellipse cx="32" cy="55" rx="5" ry="5" fill="#FFD700"/>
      <polygon points="28,60 32,70 36,60" fill="#FFD700"/>
    """,
    "lugia": """
      <!-- Lugia: silver-blue flying leviathan -->
      <ellipse cx="32" cy="50" rx="7" ry="11" fill="#C8D8F0"/>
      <polygon points="32,42 16,48 28,50" fill="#A0B8E0"/>
      <polygon points="32,42 48,48 36,50" fill="#A0B8E0"/>
      <ellipse cx="32" cy="40" rx="5" ry="4" fill="#C8D8F0"/>
      <polygon points="30,37 32,30 34,37" fill="#C8D8F0"/>
      <line x1="18" y1="50" x2="22" y2="54" stroke="#506090" stroke-width="1"/>
      <line x1="20" y1="52" x2="24" y2="56" stroke="#506090" stroke-width="1"/>
    """,
    "suicune": """
      <!-- Suicune: elegant blue dog with ribbons -->
      <ellipse cx="30" cy="50" rx="10" ry="7" fill="#2288CC"/>
      <ellipse cx="30" cy="43" rx="5" ry="4" fill="#2288CC"/>
      <polygon points="28,40 30,33 32,40" fill="#AA44CC"/>
      <polygon points="24,42 18,36 26,42" fill="#AA44CC"/>
      <rect x="18" y="53" width="4" height="8" rx="2" fill="#2288CC"/>
      <rect x="24" y="54" width="4" height="8" rx="2" fill="#2288CC"/>
      <rect x="36" y="53" width="4" height="8" rx="2" fill="#2288CC"/>
      <rect x="42" y="53" width="4" height="8" rx="2" fill="#2288CC"/>
    """,
    # Gen 3
    "groudon": """
      <!-- Groudon: massive red dinosaur -->
      <ellipse cx="32" cy="52" rx="12" ry="9" fill="#CC1010"/>
      <ellipse cx="32" cy="42" rx="7" ry="6" fill="#CC1010"/>
      <polygon points="32,38 29,30 35,30 35,36" fill="#CC1010"/>
      <polygon points="24,44 18,40 22,48" fill="#990000"/>
      <polygon points="40,44 46,40 42,48" fill="#990000"/>
      <polygon points="22,52 16,56 20,60 22,60" fill="#CC1010"/>
      <polygon points="42,52 48,56 44,60 42,60" fill="#CC1010"/>
      <rect x="26" y="44" width="12" height="5" rx="2" fill="#FFD700" opacity="0.5"/>
    """,
    "kyogre": """
      <!-- Kyogre: blue orca whale -->
      <ellipse cx="32" cy="50" rx="14" ry="9" fill="#0044BB"/>
      <polygon points="18,50 10,44 10,56" fill="#0044BB"/>
      <polygon points="46,50 54,44 54,56" fill="#0044BB"/>
      <polygon points="28,57 32,66 36,57" fill="#0044BB"/>
      <ellipse cx="32" cy="47" rx="8" ry="5" fill="#2266EE" opacity="0.6"/>
      <line x1="24" y1="48" x2="40" y2="48" stroke="#FF2244" stroke-width="1.5"/>
      <circle cx="22" cy="46" r="2" fill="#FF2244"/>
    """,
    "rayquaza": """
      <!-- Rayquaza: long serpent -->
      <path d="M32,28 Q38,35 34,42 Q28,50 34,58 Q38,65 32,70"
            fill="none" stroke="#228822" stroke-width="7" stroke-linecap="round"/>
      <path d="M32,28 Q38,35 34,42 Q28,50 34,58 Q38,65 32,70"
            fill="none" stroke="#44AA44" stroke-width="4" stroke-linecap="round"/>
      <polygon points="32,26 28,22 36,22" fill="#228822"/>
      <polygon points="26,36 20,32 26,40" fill="#FFEE00"/>
      <polygon points="42,42 48,38 42,46" fill="#FFEE00"/>
    """,
    "charizard_fr": """
      <ellipse cx="32" cy="50" rx="8" ry="10" fill="#FF6600"/>
      <polygon points="32,42 23,28 30,44" fill="#FF6600"/>
      <polygon points="32,42 41,28 34,44" fill="#FF6600"/>
      <ellipse cx="32" cy="40" rx="5" ry="5" fill="#FF6600"/>
      <polygon points="32,36 29,30 35,30" fill="#FF8800"/>
      <polygon points="38,52 46,58 40,54" fill="#FF6600"/>
      <circle cx="46" cy="58" r="3" fill="#FF2200"/>
      <circle cx="46" cy="58" r="1.5" fill="#FFEE00" opacity="0.9"/>
    """,
    "venusaur": """
      <!-- Venusaur: frog with flower -->
      <ellipse cx="32" cy="54" rx="11" ry="8" fill="#4A9E4A"/>
      <ellipse cx="32" cy="46" rx="7" ry="6" fill="#4A9E4A"/>
      <circle cx="32" cy="38" r="9" fill="#EE5599"/>
      <circle cx="32" cy="38" r="6" fill="#FF88BB"/>
      <polygon points="32,29 30,34 34,34" fill="#228833"/>
      <polygon points="26,32 24,37 28,37" fill="#228833"/>
      <polygon points="38,32 40,37 36,37" fill="#228833"/>
    """,
    # Gen 4
    "dialga": """
      <!-- Dialga: steel-blue diamond dragon -->
      <polygon points="32,30 18,50 32,62 46,50" fill="#4488CC"/>
      <polygon points="32,30 18,50 24,44" fill="#2266AA"/>
      <polygon points="32,30 46,50 40,44" fill="#2266AA"/>
      <circle cx="32" cy="46" r="6" fill="#88CCFF"/>
      <circle cx="32" cy="46" r="3" fill="#AADDFF"/>
      <polygon points="32,62 28,70 36,70" fill="#4488CC"/>
    """,
    "palkia": """
      <!-- Palkia: pink space dragon -->
      <ellipse cx="32" cy="50" rx="9" ry="12" fill="#BB44AA"/>
      <polygon points="32,40 20,46 28,50" fill="#993388"/>
      <polygon points="32,40 44,46 36,50" fill="#993388"/>
      <ellipse cx="32" cy="38" rx="5" ry="5" fill="#BB44AA"/>
      <polygon points="32,34 29,28 35,28" fill="#BB44AA"/>
      <circle cx="26" cy="47" r="3" fill="#DDAAFF" opacity="0.8"/>
      <circle cx="38" cy="47" r="3" fill="#DDAAFF" opacity="0.8"/>
    """,
    "giratina": """
      <!-- Giratina: ghost dragon -->
      <ellipse cx="32" cy="50" rx="12" ry="8" fill="#555588"/>
      <polygon points="32,44 16,50 20,56 32,52" fill="#444466"/>
      <polygon points="32,44 48,50 44,56 32,52" fill="#444466"/>
      <ellipse cx="32" cy="41" rx="6" ry="5" fill="#555588"/>
      <polygon points="26,38 22,30 30,38" fill="#880000"/>
      <polygon points="38,38 42,30 34,38" fill="#880000"/>
      <polygon points="32,58 28,68 36,68" fill="#555588"/>
    """,
    "hgss": """
      <!-- Ho-Oh (gold) / Lugia (silver) split -->
      <polygon points="32,38 14,52 32,56 50,52" fill="#EE8800"/>
      <polygon points="14,52 32,56 32,38" fill="#FFD700"/>
      <polygon points="50,52 32,56 32,38" fill="#C8D8F0"/>
      <ellipse cx="32" cy="39" rx="4" ry="4" fill="#FFD700"/>
    """,
    # Gen 5
    "reshiram": """
      <!-- Reshiram: white dragon -->
      <ellipse cx="32" cy="50" rx="9" ry="12" fill="#EEEEEE"/>
      <polygon points="32,40 18,48 28,52" fill="#DDDDDD"/>
      <polygon points="32,40 46,48 36,52" fill="#DDDDDD"/>
      <ellipse cx="32" cy="38" rx="5" ry="5" fill="#FFFFFF"/>
      <polygon points="32,34 29,28 35,28" fill="#DDDDDD"/>
      <circle cx="32" cy="58" r="5" fill="#AADDFF" opacity="0.8"/>
      <circle cx="32" cy="58" r="3" fill="#88BBFF" opacity="0.9"/>
    """,
    "zekrom": """
      <!-- Zekrom: black dragon -->
      <ellipse cx="32" cy="50" rx="9" ry="12" fill="#333355"/>
      <polygon points="32,40 18,48 28,52" fill="#222244"/>
      <polygon points="32,40 46,48 36,52" fill="#222244"/>
      <ellipse cx="32" cy="38" rx="5" ry="5" fill="#444466"/>
      <polygon points="32,34 29,28 35,28" fill="#333355"/>
      <circle cx="32" cy="58" r="5" fill="#44AAFF" opacity="0.8"/>
      <circle cx="32" cy="58" r="3" fill="#88CCFF" opacity="0.9"/>
    """,
    # Gen 6
    "xerneas": """
      <!-- Xerneas: fairy deer -->
      <ellipse cx="32" cy="54" rx="9" ry="6" fill="#2244AA"/>
      <ellipse cx="32" cy="46" rx="5" ry="5" fill="#2244AA"/>
      <path d="M30,42 Q24,34 20,30" fill="none" stroke="#4488FF" stroke-width="2"/>
      <path d="M30,42 Q26,33 24,28" fill="none" stroke="#88BBFF" stroke-width="1.5"/>
      <path d="M34,42 Q40,34 44,30" fill="none" stroke="#4488FF" stroke-width="2"/>
      <path d="M34,42 Q38,33 40,28" fill="none" stroke="#88BBFF" stroke-width="1.5"/>
      <ellipse cx="32" cy="44" rx="2" ry="2" fill="#88CCFF"/>
    """,
    "yveltal": """
      <!-- Yveltal: dark bird -->
      <ellipse cx="32" cy="50" rx="6" ry="12" fill="#CC2222"/>
      <polygon points="32,42 12,50 22,55" fill="#991111"/>
      <polygon points="32,42 52,50 42,55" fill="#991111"/>
      <polygon points="32,38 28,30 36,30" fill="#CC2222"/>
      <polygon points="26,62 30,70 34,62" fill="#CC2222"/>
    """,
    "primal_groudon": """
      <ellipse cx="32" cy="52" rx="12" ry="9" fill="#AA0000"/>
      <ellipse cx="32" cy="42" rx="7" ry="6" fill="#AA0000"/>
      <polygon points="24,44 18,40 22,48" fill="#880000"/>
      <polygon points="40,44 46,40 42,48" fill="#880000"/>
      <rect x="26" y="44" width="12" height="5" rx="2" fill="#FF4400" opacity="0.7"/>
    """,
    # Gen 7
    "solgaleo": """
      <!-- Solgaleo: sun lion -->
      <circle cx="32" cy="48" r="12" fill="#EEB800"/>
      <circle cx="32" cy="48" r="8" fill="#FFD700"/>
      <polygon points="32,36 29,42 35,42" fill="#EEB800"/>
      <polygon points="20,42 24,46 22,50" fill="#EEB800"/>
      <polygon points="44,42 40,46 42,50" fill="#EEB800"/>
      <polygon points="20,54 24,50 22,58" fill="#EEB800"/>
      <polygon points="44,54 40,50 42,58" fill="#EEB800"/>
      <polygon points="32,60 29,54 35,54" fill="#EEB800"/>
      <circle cx="32" cy="48" r="4" fill="#FFFFFF" opacity="0.4"/>
    """,
    "lunala": """
      <!-- Lunala: moon bat -->
      <ellipse cx="32" cy="50" rx="7" ry="10" fill="#220055"/>
      <polygon points="32,44 12,50 22,58" fill="#330077"/>
      <polygon points="32,44 52,50 42,58" fill="#330077"/>
      <polygon points="12,50 8,42 18,48" fill="#220055"/>
      <polygon points="52,50 56,42 46,48" fill="#220055"/>
      <circle cx="32" cy="44" r="5" fill="#FFFFFF" opacity="0.15"/>
      <path d="M28,44 Q32,40 36,44" fill="none" stroke="#AAAAFF" stroke-width="1"/>
    """,
    "necrozma": """
      <!-- Ultra Necrozma / Necrozma -->
      <polygon points="32,30 26,44 32,50 38,44" fill="#FFEE00"/>
      <polygon points="32,50 22,58 28,62 32,58" fill="#DDCC00"/>
      <polygon points="32,50 42,58 36,62 32,58" fill="#DDCC00"/>
      <polygon points="32,30 20,40 26,44" fill="#EEDD00"/>
      <polygon points="32,30 44,40 38,44" fill="#EEDD00"/>
      <circle cx="32" cy="44" r="4" fill="#FFFFFF" opacity="0.5"/>
    """,
    # Gen 8+
    "zacian": """
      <!-- Zacian: sword wolf -->
      <ellipse cx="32" cy="52" rx="9" ry="7" fill="#5588BB"/>
      <ellipse cx="32" cy="44" rx="6" ry="5" fill="#5588BB"/>
      <polygon points="28,40 24,32 32,40" fill="#7AACDD"/>
      <polygon points="36,40 40,32 32,40" fill="#7AACDD"/>
      <rect x="30" y="28" width="4" height="24" rx="1" fill="#DDDDDD"/>
      <polygon points="30,28 32,22 34,28" fill="#FFDD00"/>
    """,
    "zamazenta": """
      <!-- Zamazenta: shield wolf -->
      <ellipse cx="32" cy="52" rx="9" ry="7" fill="#AA3388"/>
      <ellipse cx="32" cy="44" rx="6" ry="5" fill="#AA3388"/>
      <polygon points="28,40 24,32 32,40" fill="#CC55AA"/>
      <polygon points="36,40 40,32 32,40" fill="#CC55AA"/>
      <ellipse cx="32" cy="38" rx="8" ry="5" fill="#DDAACC" opacity="0.5"/>
    """,
    "dialga2": """
      <polygon points="32,30 18,50 32,62 46,50" fill="#3377BB"/>
      <circle cx="32" cy="46" r="5" fill="#99CCFF"/>
    """,
    "arceus": """
      <!-- Arceus: the god pokemon -->
      <circle cx="32" cy="48" r="10" fill="#EEE8D0"/>
      <circle cx="32" cy="48" r="7" fill="#FFFFFF"/>
      <circle cx="32" cy="48" r="6" fill="#DDC880"/>
      <polygon points="32,38 30,42 34,42" fill="#EEE8D0"/>
      <polygon points="22,44 26,46 26,50" fill="#EEE8D0"/>
      <polygon points="42,44 38,46 38,50" fill="#EEE8D0"/>
      <polygon points="22,52 26,50 26,54" fill="#EEE8D0"/>
      <polygon points="42,52 38,50 38,54" fill="#EEE8D0"/>
      <polygon points="32,58 30,54 34,54" fill="#EEE8D0"/>
    """,
    "koraidon": """
      <!-- Koraidon: red lizard ancient -->
      <ellipse cx="32" cy="52" rx="10" ry="8" fill="#CC2200"/>
      <ellipse cx="32" cy="42" rx="6" ry="5" fill="#CC2200"/>
      <polygon points="32,38 26,30 38,30" fill="#CC2200"/>
      <circle cx="32" cy="38" r="4" fill="#FF6600"/>
      <polygon points="22,50 16,46 18,54" fill="#AA1100"/>
      <polygon points="42,50 48,46 46,54" fill="#AA1100"/>
    """,
    "miraidon": """
      <!-- Miraidon: purple electric lizard -->
      <ellipse cx="32" cy="52" rx="10" ry="8" fill="#6600BB"/>
      <ellipse cx="32" cy="42" rx="6" ry="5" fill="#6600BB"/>
      <polygon points="32,38 26,30 38,30" fill="#6600BB"/>
      <circle cx="32" cy="38" r="4" fill="#8800EE"/>
      <polygon points="22,50 16,46 18,54" fill="#4400AA"/>
      <polygon points="42,50 48,46 46,54" fill="#4400AA"/>
      <circle cx="32" cy="38" r="2" fill="#44DDFF" opacity="0.9"/>
    """,
    "calyrex": """
      <!-- Legends Z-A: Zygarde/generic -->
      <polygon points="32,30 20,50 32,56 44,50" fill="#229922"/>
      <circle cx="32" cy="48" r="6" fill="#33BB33"/>
      <polygon points="28,38 24,28 32,38" fill="#116611"/>
      <polygon points="36,38 40,28 32,38" fill="#116611"/>
    """,
    "go_ball": """
      <!-- Pokemon GO logo pokeball -->
      <circle cx="32" cy="48" r="14" fill="#EE1515"/>
      <rect x="18" y="46" width="28" height="4" fill="#FFFFFF"/>
      <rect x="18" y="46" width="28" height="4" fill="#222222" opacity="0.15"/>
      <circle cx="32" cy="48" r="14" fill="none" stroke="#222" stroke-width="1"/>
      <circle cx="32" cy="48" r="6" fill="#FFFFFF"/>
      <circle cx="32" cy="48" r="4" fill="#EEEEEE"/>
      <line x1="18" y1="48" x2="26" y2="48" stroke="#222" stroke-width="1"/>
      <line x1="38" y1="48" x2="46" y2="48" stroke="#222" stroke-width="1"/>
    """,
}


# ─── Platform shape builders ─────────────────────────────────────────────────

def gb(body: str, label: str, label2: str, text_col: str,
       platform_lbl: str, game_title: str, sil_key: str) -> str:
    """Game Boy cartridge (gray/colored body, bottom-left notch, contacts)."""
    sil = SIL.get(sil_key, "")
    return f"""\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{label}"/>
      <stop offset="100%" stop-color="{label2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Plastic body (gray) -->
  <path d="M4,0 H60 Q64,0 64,4 V76 H20 V92 Q20,100 12,100 H4 Q0,100 0,92 V4 Q0,0 4,0 Z"
        fill="url(#bg)" stroke="#707070" stroke-width="0.5"/>
  <!-- Contact strips (gold) -->
  <rect x="24" y="80" width="5" height="14" rx="1" fill="#B8960C"/>
  <rect x="31" y="80" width="5" height="14" rx="1" fill="#B8960C"/>
  <rect x="38" y="80" width="5" height="14" rx="1" fill="#B8960C"/>
  <rect x="45" y="80" width="5" height="14" rx="1" fill="#B8960C"/>
  <rect x="52" y="80" width="5" height="14" rx="1" fill="#B8960C"/>
  <!-- Label (paper sticker) -->
  <rect x="3" y="4" width="58" height="68" rx="2" fill="url(#lbl)"/>
  <rect x="3" y="4" width="58" height="68" rx="2" fill="url(#shine)"/>
  <!-- Platform label -->
  <text x="32" y="14" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="5.5" font-weight="700" fill="{text_col}" opacity="0.85">{platform_lbl}</text>
  <!-- Separator line -->
  <line x1="8" y1="17" x2="56" y2="17" stroke="{text_col}" stroke-width="0.5" opacity="0.3"/>
  <!-- Pokemon silhouette -->
  {sil}
  <!-- Game title bar at bottom of label -->
  <rect x="3" y="60" width="58" height="12" rx="0" fill="rgba(0,0,0,0.25)"/>
  <text x="32" y="70" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="7.5" font-weight="900" fill="white" letter-spacing="0.2">{game_title}</text>
</svg>"""


def gba(body: str, body2: str, label: str, label2: str,
        text_col: str, game_title: str, sil_key: str) -> str:
    """Game Boy Advance cartridge (colored body, contacts on top edge)."""
    sil = SIL.get(sil_key, "")
    return f"""\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{body}"/>
      <stop offset="100%" stop-color="{body2}"/>
    </linearGradient>
    <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{label}"/>
      <stop offset="100%" stop-color="{label2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- GBA body (colored plastic) -->
  <path d="M4,0 H60 Q64,0 64,4 V96 Q64,100 60,100 H4 Q0,100 0,96 V4 Q0,0 4,0 Z"
        fill="url(#bg)" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
  <!-- Top contact slot -->
  <rect x="20" y="0" width="24" height="5" fill="#111" rx="0"/>
  <!-- GBA contact strips (gold, at top) -->
  <rect x="21" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="26" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="31" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="36" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="41" y="0" width="3" height="4" fill="#B8960C"/>
  <!-- GBA chip indicator (small notch top-right of contacts) -->
  <rect x="44" y="0" width="1" height="5" fill="#333"/>
  <!-- Label area -->
  <rect x="4" y="8" width="56" height="68" rx="2" fill="url(#lbl)"/>
  <rect x="4" y="8" width="56" height="68" rx="2" fill="url(#shine)"/>
  <!-- Platform text -->
  <text x="32" y="18" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="5" font-weight="700" fill="{text_col}" opacity="0.85">GAME BOY ADVANCE</text>
  <line x1="8" y1="21" x2="56" y2="21" stroke="{text_col}" stroke-width="0.4" opacity="0.3"/>
  <!-- Silhouette -->
  {sil}
  <!-- Game title -->
  <rect x="4" y="64" width="56" height="12" rx="0" fill="rgba(0,0,0,0.25)"/>
  <text x="32" y="74" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="7.5" font-weight="900" fill="white" letter-spacing="0.2">{game_title}</text>
  <!-- Nintendo logo at bottom -->
  <text x="32" y="92" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="5" fill="{text_col}" opacity="0.5">Nintendo</text>
</svg>"""


def ds(body: str, body2: str, label: str, label2: str,
       text_col: str, game_title: str, sil_key: str, platform: str = "Nintendo DS") -> str:
    """Nintendo DS / 3DS card (top-right notch, contacts at bottom)."""
    sil = SIL.get(sil_key, "")
    return f"""\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{body}"/>
      <stop offset="100%" stop-color="{body2}"/>
    </linearGradient>
    <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{label}"/>
      <stop offset="100%" stop-color="{label2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- DS card body with top-right notch -->
  <path d="M4,0 H46 L64,18 V96 Q64,100 60,100 H4 Q0,100 0,96 V4 Q0,0 4,0 Z"
        fill="url(#bg)" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
  <path d="M46,0 L64,18 H46 Z" fill="rgba(0,0,0,0.2)"/>
  <!-- Bottom contacts -->
  <rect x="12" y="95" width="5" height="5" rx="0.5" fill="#B8960C"/>
  <rect x="19" y="95" width="5" height="5" rx="0.5" fill="#B8960C"/>
  <rect x="26" y="95" width="5" height="5" rx="0.5" fill="#B8960C"/>
  <rect x="33" y="95" width="5" height="5" rx="0.5" fill="#B8960C"/>
  <rect x="40" y="95" width="5" height="5" rx="0.5" fill="#B8960C"/>
  <!-- Label -->
  <rect x="3" y="22" width="58" height="62" rx="2" fill="url(#lbl)"/>
  <rect x="3" y="22" width="58" height="62" rx="2" fill="url(#shine)"/>
  <!-- Platform text in notch area -->
  <text x="28" y="12" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="5" font-weight="700" fill="rgba(255,255,255,0.8)">{platform}</text>
  <!-- Silhouette -->
  {sil}
  <!-- Title bar -->
  <rect x="3" y="72" width="58" height="12" rx="0" fill="rgba(0,0,0,0.25)"/>
  <text x="32" y="82" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="7" font-weight="900" fill="white" letter-spacing="0.2">{game_title}</text>
</svg>"""


def sw(body: str, body2: str, label: str, label2: str,
       text_col: str, game_title: str, sil_key: str) -> str:
    """Nintendo Switch game card."""
    sil = SIL.get(sil_key, "")
    return f"""\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{label}"/>
      <stop offset="100%" stop-color="{label2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Switch card body (dark gray/black plastic) -->
  <path d="M4,0 H60 Q64,0 64,4 V96 Q64,100 60,100 H4 Q0,100 0,96 V4 Q0,0 4,0 Z"
        fill="url(#bg)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <!-- Top chip slot -->
  <rect x="20" y="0" width="24" height="6" rx="0" fill="#080808"/>
  <rect x="21" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="26" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="31" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="36" y="0" width="3" height="4" fill="#B8960C"/>
  <rect x="41" y="0" width="3" height="4" fill="#B8960C"/>
  <!-- Label -->
  <rect x="3" y="10" width="58" height="72" rx="2" fill="url(#lbl)"/>
  <rect x="3" y="10" width="58" height="72" rx="2" fill="url(#shine)"/>
  <!-- Nintendo Switch text -->
  <text x="32" y="20" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="5" font-weight="700" fill="{text_col}" opacity="0.8">Nintendo Switch</text>
  <line x1="8" y1="23" x2="56" y2="23" stroke="{text_col}" stroke-width="0.4" opacity="0.3"/>
  <!-- Silhouette -->
  {sil}
  <!-- Title bar -->
  <rect x="3" y="70" width="58" height="12" rx="0" fill="rgba(0,0,0,0.3)"/>
  <text x="32" y="80" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="6.5" font-weight="900" fill="white" letter-spacing="0.2">{game_title}</text>
</svg>"""


def mobile(body: str, body2: str, game_title: str, sil_key: str) -> str:
    """Mobile app (phone shape)."""
    sil = SIL.get(sil_key, "")
    return f"""\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100">
  <defs>
    <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{body}"/>
      <stop offset="100%" stop-color="{body2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Phone outline -->
  <rect x="8" y="0" width="48" height="100" rx="8" fill="#1a1a2a"
        stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <!-- Screen -->
  <rect x="11" y="10" width="42" height="74" rx="4" fill="url(#lbl)"/>
  <rect x="11" y="10" width="42" height="74" rx="4" fill="url(#shine)"/>
  <!-- Speaker grill -->
  <rect x="24" y="3" width="16" height="3" rx="1.5" fill="#2a2a3a"/>
  <!-- Front camera -->
  <circle cx="46" cy="4.5" r="1.5" fill="#2a2a3a"/>
  <!-- Home bar -->
  <rect x="22" y="88" width="20" height="3" rx="1.5" fill="#2a2a3a"/>
  <!-- App content -->
  {sil}
  <text x="32" y="82" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="7" font-weight="900" fill="white">{game_title}</text>
</svg>"""


# ─── Game definitions ─────────────────────────────────────────────────────────
# (game_id, builder, *args)

GAMES = [
    # Game Boy
    ("red-blue",      gb,  "#B0B0B0", "#CC1010", "#101090", "white",  "GAME BOY",          "PKMN RED/BLUE", "charizard"),
    ("yellow",        gb,  "#B8B800", "#F0D000", "#E0C000", "#222",   "GAME BOY COLOR",    "PKMN YELLOW",   "pikachu"),
    # Game Boy Color
    ("gold-silver",   gb,  "#C89600", "#C89600", "#707878", "white",  "GAME BOY COLOR",    "GOLD / SILVER", "ho-oh"),
    ("crystal",       gb,  "#446699", "#2266BB", "#88AABB", "white",  "GAME BOY COLOR",    "CRYSTAL",       "suicune"),
    # GBA
    ("ruby-sapphire", gba, "#990010", "#660000", "#CC1018", "#800010", "white",  "RUBY/SAPPHIRE", "groudon"),
    ("emerald",       gba, "#006630", "#004420", "#009944", "#004422", "white",  "EMERALD",       "rayquaza"),
    ("firered-leafgreen", gba, "#CC3300","#992200","#FF5500","#33AA00","white",  "FR / LG",       "charizard_fr"),
    # DS
    ("diamond-pearl",      ds, "#1144BB","#0A2D88","#1A55CC","#AA44AA","white", "D / P",  "dialga",   "Nintendo DS"),
    ("platinum",           ds, "#778899","#445566","#99AACC","#556677","white", "PLATINUM","giratina",  "Nintendo DS"),
    ("heartgold-soulsilver",ds,"#BB8800","#6677AA","#CC9900","#8899BB","white", "HG / SS", "hgss",     "Nintendo DS"),
    ("black-white",        ds, "#111111","#000000","#222222","#DDDDDD","white", "B / W",   "reshiram", "Nintendo DS"),
    ("black2-white2",      ds, "#222244","#111133","#333388","#DDDDF8","white", "B2 / W2", "zekrom",   "Nintendo DS"),
    # 3DS
    ("x-y",           ds, "#1144CC","#882222","#2255DD","#991111","white", "X / Y",   "xerneas",   "Nintendo 3DS"),
    ("oras",          ds, "#CC2200","#003399","#DD3300","#0044BB","white", "OR / AS",  "primal_groudon","Nintendo 3DS"),
    ("sun-moon",      ds, "#EE7700","#442299","#FF8800","#5533AA","white", "SUN/MOON", "solgaleo",  "Nintendo 3DS"),
    ("usum",          ds, "#DDAA00","#330088","#EEBa00","#440099","white", "USUM",     "necrozma",  "Nintendo 3DS"),
    # Switch
    ("lets-go",       sw, "#E8A800","#CC8800","#F0C000","#AA6600","#222",  "LET'S GO",     "pikachu"),
    ("sword-shield",  sw, "#0033AA","#001166","#0044CC","#AA0000","white", "SWORD/SHIELD", "zacian"),
    ("bdsp",          sw, "#1133AA","#000D55","#2244BB","#BB4499","white", "BD / SP",      "dialga2"),
    ("legends-arceus",sw, "#1A4A3A","#0A2A1A","#2A7A5A","#1A5A3A","white", "LEGENDS:ARCEUS","arceus"),
    ("scarlet-violet",sw, "#AA1100","#550000","#CC2200","#5500AA","white", "SCARLET/VIOLET","koraidon"),
    ("legends-za",    sw, "#311B92","#1A0055","#4422AA","#220066","white", "LEGENDS: Z-A",  "calyrex"),
    ("pokemon-go",    mobile, "#0077DD","#004499",             "GO",           "go_ball"),
]


def write_all():
    for spec in GAMES:
        game_id = spec[0]
        fn      = spec[1]
        args    = spec[2:]
        svg = fn(*args)
        path = OUT / f"{game_id}.svg"
        path.write_text(svg.strip())
        print(f"  {path}")


if __name__ == "__main__":
    write_all()
    print(f"\nDone — {len(GAMES)} cartridges generated.")