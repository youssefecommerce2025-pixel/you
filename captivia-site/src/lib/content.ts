import type { FeatureId, FontId, PaletteId, Universe } from './design'
import type { OfferId, QuestionId } from './diagnostic'

export type Lang = 'fr' | 'ar'

interface OfferContent {
  name: string
  tag: string
  price: string
  market: string
  idealFor: string
  need: string
  features: string[]
  delay: string
}

interface QuestionContent {
  title: string
  help?: string
  options: Record<string, string>
}

const fr = {
  colon: ' : ',
  meta: {
    title: 'Captivia — Sites e-commerce sur mesure pour marques marocaines de parfum & beauté',
    description:
      "Captivia façonne des boutiques en ligne sur mesure pour les marques marocaines de parfumerie, soins et cosmétiques : commande en 1 clic avec paiement à la livraison, fiches produits expertes, packs. Dès 1 499 DH.",
  },
  nav: {
    story: 'Notre histoire',
    atelier: "L'atelier",
    offers: 'Offres',
    compare: 'Comparatif',
    faq: 'FAQ',
    cta: 'Diagnostic gratuit',
    switchTo: 'العربية',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'Atelier e-commerce · Parfum & Beauté · Maroc',
    titleA: 'Votre marque fait rêver sur Instagram.',
    titleB: 'Votre site doit ',
    titleHighlight: 'faire commander.',
    subtitle:
      "Captivia façonne, avec vous, des boutiques en ligne sur mesure pour les marques marocaines de parfumerie, de soins et de cosmétiques. Une vitrine digne de vos flacons, une commande en 1 clic avec paiement à la livraison, et des ventes qui tombent même quand vous dormez.",
    ctaPrimary: 'Façonner mon site en direct',
    ctaSecondary: 'Trouver mon offre en 2 min',
    stats: [
      { value: '1 499 DH', label: 'pour démarrer, prix affichés' },
      { value: '0 $', label: "d'abonnement plateforme par mois" },
      { value: '1 clic', label: 'pour commander, paiement à la livraison' },
    ],
    demoBrands: ['Maison Oud', 'Argane & Rose', 'Nuit de Fès', 'Votre marque'],
    building: 'Votre site se construit…',
    scroll: 'Découvrir l’histoire',
  },
  story: {
    eyebrow: 'Il était une fois… votre marque',
    title: 'Toutes les belles marques marocaines vivent la même histoire.',
    chapters: [
      {
        kicker: 'Chapitre 1 · L’étincelle',
        title: 'Tout commence par une obsession.',
        body:
          "Un accord oud-rose testé cent fois. Une huile d’argan travaillée jusqu’à la texture parfaite. Des nuits à choisir un flacon, un bouchon, une couleur de boîte. Puis la première photo sur Instagram — et ces cœurs qui n’arrêtent plus de tomber.",
      },
      {
        kicker: 'Chapitre 2 · Le paradoxe',
        title: '23 h 47. 38 messages non lus.',
        body:
          "Pendant que vous répondez à une cliente, trois autres sont déjà parties chez le concurrent. Alors vous ouvrez un site : un thème générique, le même que la boutique de gadgets d’à côté, un abonnement en dollars, une application COD payante en plus… Et votre parfum de luxe ressemble soudain à un produit de dropshipping.",
      },
      {
        kicker: 'Chapitre 3 · Le déclic',
        title: 'Et si votre site était aussi beau que votre flacon ?',
        body:
          "Et s’il répondait à « bch7al ? » à votre place, à 3 h du matin ? C’est là que Captivia entre dans l’histoire : un atelier qui ne fait qu’une seule chose — des boutiques en ligne pour les marques marocaines de parfum et de beauté. Pas de mode, pas de gadgets. Votre univers, et seulement le vôtre.",
      },
      {
        kicker: 'Chapitre 4 · La métamorphose',
        title: 'Votre cliente commande. Vous, vous dormez.',
        body:
          "Elle arrive depuis une story. Elle découvre la pyramide olfactive, lit les avis de Casablanca à Oujda, compose son pack 3 + 1, commande en 30 secondes et paie à la livraison. Le lendemain matin, la commande vous attend sur WhatsApp, prête à expédier.",
      },
    ],
    chat: {
      header: 'Messages · votre page',
      messages: [
        'Salam, bch7al had l3tr ? 🙏',
        'Kayn livraison l Agadir ?',
        'Wach kayn 50ml ?',
        'Ça tient combien de temps sur la peau ?',
        'Allo ?? 😕',
      ],
      seen: 'Vu · la cliente est partie',
    },
    outroTitle: 'Chapitre 5 · Le vôtre',
    outro: 'La suite de votre histoire ne s’écrit pas avec un template. Elle s’écrit avec vous.',
    cta: 'Écrire mon chapitre',
  },
  atelier: {
    eyebrow: "L'atelier Captivia",
    title: 'Façonnez votre site. Là, maintenant.',
    subtitle:
      "Chaque marque est unique : c’est vous qui décidez. Tapez le nom de votre marque, choisissez votre univers, vos couleurs et vos fonctionnalités — la maquette se transforme sous vos yeux. C’est exactement comme ça que nous travaillerons ensemble.",
    steps: ['Votre nom', 'Votre univers', 'Vos couleurs', 'Votre écriture', 'Vos super-pouvoirs'],
    brandLabel: 'Le nom de votre marque',
    brandPlaceholder: 'ex. Maison Yasmine',
    universeLabel: 'Votre univers',
    universes: { parfum: 'Parfumerie', soin: 'Soins & skincare', cosmetique: 'Cosmétiques' } as Record<Universe, string>,
    paletteLabel: 'Votre palette',
    palettes: {
      amethyste: 'Améthyste',
      'noir-or': 'Noir & or',
      rose: 'Rose poudré',
      oud: 'Sable & oud',
      botanique: 'Botanique',
    } as Record<PaletteId, string>,
    fontLabel: 'Votre typographie',
    fonts: { elegante: 'Élégante', editoriale: 'Éditoriale', moderne: 'Moderne' } as Record<FontId, string>,
    featuresLabel: 'Ce que votre site doit savoir faire',
    features: {
      cod: 'Commande 1 clic + paiement à la livraison',
      story: 'Fiche produit experte',
      pack: 'Pack « 3 achetés = 1 offert »',
      avis: 'Avis clientes du Maroc',
      quiz: 'Quiz « trouvez votre produit »',
      bilingue: 'Version français / arabe',
    } as Record<FeatureId, string>,
    cta: 'Je veux ce site — trouver mon offre',
    live: 'Aperçu en direct',
    note: 'Votre maquette est jointe à votre diagnostic : on part de vos choix, pas d’un modèle.',
  },
  preview: {
    defaultBrand: 'Votre marque',
    menu: ['Nouveautés', 'Best-sellers', 'Coffrets'],
    universes: {
      parfum: {
        tagline: 'Parfums inspirés du Maroc',
        heroTitle: 'L’art de laisser une trace',
        items: [
          { name: 'Oud Impérial', price: '349 DH' },
          { name: 'Rose de Kelâa', price: '289 DH' },
        ],
        storyTitle: 'Pyramide olfactive',
        storyRows: [
          ['Tête', 'Safran · Bergamote'],
          ['Cœur', 'Rose damascena'],
          ['Fond', 'Oud · Ambre'],
        ],
        quiz: 'Trouvez votre parfum signature en 5 questions',
      },
      soin: {
        tagline: 'Soins naturels du Maroc',
        heroTitle: 'Le rituel de votre peau',
        items: [
          { name: 'Sérum Argan Or', price: '259 DH' },
          { name: 'Crème Nila', price: '219 DH' },
        ],
        storyTitle: 'Rituel & ingrédients',
        storyRows: [
          ['Actif', 'Argan bio · Vitamine E'],
          ['Peau', 'Sèche à mixte'],
          ['Moment', 'Matin & soir'],
        ],
        quiz: 'Diagnostic de peau en 5 questions',
      },
      cosmetique: {
        tagline: 'Beauté pensée au Maroc',
        heroTitle: 'Révélez votre éclat',
        items: [
          { name: 'Rouge Velours Prune', price: '149 DH' },
          { name: 'Poudre Lumière', price: '189 DH' },
        ],
        storyTitle: 'Teintes & tenue',
        storyRows: [
          ['Fini', 'Mat velours'],
          ['Tenue', 'Jusqu’à 12 h'],
          ['Teintes', '8 nuances'],
        ],
        quiz: 'Trouvez votre teinte parfaite en 5 questions',
      },
    } as Record<
      Universe,
      {
        tagline: string
        heroTitle: string
        items: { name: string; price: string }[]
        storyTitle: string
        storyRows: [string, string][]
        quiz: string
      }
    >,
    newIn: 'Nouveau',
    pack: '3 achetés = 1 offert',
    packSub: 'Ajoutez 1 produit pour débloquer le cadeau',
    reviews: '4,9/5 · 312 avis du Maroc',
    reviewQuote: '« Livré en 24 h à Rabat, tenue incroyable ! »',
    cod: 'Commander · paiement à la livraison',
    codSub: 'Nom, téléphone, ville — c’est tout.',
    discover: 'Découvrir',
  },
  compare: {
    eyebrow: 'Le comparatif',
    title: 'Pourquoi tant de belles marques perdent des ventes en ligne.',
    subtitle:
      "Nous avons étudié les offres des agences web marocaines et les boutiques des marques de parfum et de beauté. Voici ce qu’on y trouve — et ce que Captivia fait autrement.",
    columns: ['Agences généralistes', 'Template fait soi-même', 'Captivia'],
    rows: [
      {
        label: 'Prix d’une boutique',
        a: '4 500 à 17 900 DH, souvent « sur devis »',
        b: 'Gratuit au début… puis thème, applis et abonnement',
        c: '1 499 à 4 999 DH, prix fixes et affichés',
      },
      {
        label: 'Abonnement mensuel',
        a: 'Plateforme à votre charge, parfois en dollars',
        b: 'Oui, et il augmente avec les applis',
        c: 'Aucun abonnement de plateforme',
      },
      {
        label: 'Spécialité',
        a: 'Mode, bijoux, meubles, gadgets…',
        b: 'Aucune',
        c: '100 % parfum, soins et cosmétiques',
      },
      {
        label: 'Fiche produit',
        a: 'Photo, prix, description standard',
        b: 'Celle du thème, comme tout le monde',
        c: 'Pyramide olfactive, tenue, ingrédients, rituel',
      },
      {
        label: 'Paiement à la livraison',
        a: 'Via des applications tierces souvent payantes',
        b: 'Tunnel long, création de compte',
        c: 'Natif, en 1 clic, relié à votre WhatsApp',
      },
      {
        label: 'Délai de mise en ligne',
        a: '2 à 10 semaines',
        b: 'Des semaines de bricolage le soir',
        c: 'Dès 5 jours',
      },
      {
        label: 'Image de marque',
        a: 'Thème personnalisé à la marge',
        b: 'Le même thème que des milliers de boutiques',
        c: 'Identité sur mesure, maquette validée avec vous',
      },
    ],
    source: 'Fourchettes relevées sur les pages tarifs publiques d’agences web marocaines, novembre 2026.',
  },
  offers: {
    eyebrow: 'Nos 3 offres',
    title: 'Une offre pour chaque étape de votre marque.',
    subtitle: 'Des prix fixes, affichés, et nettement sous ceux du marché. Vous savez ce que vous payez avant même de nous parler.',
    currency: 'DH',
    oneTime: 'paiement unique',
    popular: 'Le plus choisi',
    idealFor: 'Idéale pour',
    need: 'Votre besoin',
    included: 'Ce qui est inclus',
    cta: 'Vérifier si c’est mon offre',
    market: 'Prix du marché',
    items: {
      essentiel: {
        name: 'L’Essentiel Express',
        tag: 'Le tremplin',
        price: '1 499',
        market: '2 500 DH et plus',
        idealFor: 'Les marques qui vendent par Instagram, TikTok ou WhatsApp et perdent des ventes à cause du temps de réponse.',
        need: 'Arrêter de répondre à « bch7al ? » toute la journée et automatiser la prise de commande, sans effrayer la cliente marocaine.',
        features: [
          'Landing page ultra-rapide, pensée d’abord pour le mobile',
          'Catalogue jusqu’à 20 produits',
          'Formulaire paiement à la livraison en 1 clic (nom, téléphone, ville) relié à votre WhatsApp',
          'Pas de création de compte, pas de panier compliqué',
          'Design épuré aux codes du luxe, à vos couleurs',
        ],
        delay: 'En ligne dès 5 jours',
      },
      experience: {
        name: 'L’Expérience Olfactive',
        tag: 'Le best-seller',
        price: '2 899',
        market: '4 000 à 6 000 DH',
        idealFor: 'Les marques déjà sur YouCan ou Shopify qui veulent sortir du générique et augmenter leur panier moyen.',
        need: 'Avoir un site qui fait « vraie maison de luxe » et vendre plus de produits à chaque cliente.',
        features: [
          'Tout l’Essentiel Express',
          'Fiches produits expertes : pyramide olfactive (tête, cœur, fond), intensité, saison — ou ingrédients et rituel pour les soins',
          'Upsell automatique : « 3 achetés = 1 offert », packs découverte, coffrets',
          'Avis clientes réels du Maroc pour la preuve sociale',
          'Catalogue élargi et reprise de vos produits existants',
        ],
        delay: 'En ligne en 10 jours',
      },
      prestige: {
        name: 'Prestige & Sur-Mesure',
        tag: 'L’offre d’autorité',
        price: '4 999',
        market: '10 000 DH et plus',
        idealFor: 'Les marques ambitieuses qui veulent une expérience digne des grandes maisons.',
        need: 'Dominer votre marché avec une technologie de pointe et une expérience client inoubliable.',
        features: [
          'Tout l’Expérience Olfactive',
          'Site sur mesure ultra-rapide (React / Vite)',
          'Quiz interactif « Trouvez votre parfum signature en 5 questions » ou diagnostic de peau',
          'Animations fluides pour un effet « waouh »',
          'Version bilingue français / arabe',
          'Tableau de bord et suivi des conversions',
        ],
        delay: 'En ligne en 3 semaines',
      },
    } as Record<OfferId, OfferContent>,
    guaranteesTitle: 'Inclus dans toutes les offres',
    guarantees: [
      'Maquette validée avec vous avant le développement',
      'Site et nom de domaine à votre nom',
      'Reprise de vos produits, photos et avis existants',
      'Formation pour gérer vos commandes en autonomie',
      'Paiement en 2 fois : 50 % au lancement, 50 % à la mise en ligne',
    ],
  },
  method: {
    eyebrow: 'La méthode',
    title: 'De votre idée à votre première commande.',
    steps: [
      { title: 'Le diagnostic', body: '2 minutes pour comprendre votre marque, vos ventes et vos vrais besoins.' },
      { title: 'La maquette', body: 'Sous 48 h, vous voyez votre site à vos couleurs. Vous ajustez, on affine.' },
      { title: 'La création', body: 'Nous construisons, intégrons vos produits et branchons la commande sur WhatsApp.' },
      { title: 'Le lancement', body: 'Mise en ligne, formation, et votre lien prêt à mettre en bio et dans vos pubs.' },
    ],
  },
  diagnostic: {
    eyebrow: 'Diagnostic gratuit · 2 minutes',
    title: 'Quelle offre est faite pour votre marque ?',
    subtitle:
      'Répondez à quelques questions : chaque réponse fait apparaître la suivante. À la fin, nous vous recommandons l’offre qui correspond vraiment à vos besoins — sans engagement.',
    start: 'Commencer le diagnostic',
    duration: '8 questions · 2 min',
    question: 'Question',
    of: 'sur',
    back: 'Retour',
    next: 'Continuer',
    skip: 'Passer',
    multiHint: 'Plusieurs choix possibles',
    keyHint: 'Astuce : appuyez sur A, B, C… pour répondre',
    interested: (offer: string) => `Vous regardez « ${offer} » : le diagnostic va vérifier que c’est la bonne offre pour vous.`,
    questions: {
      univers: {
        title: 'Quel est l’univers de votre marque ?',
        options: { parfum: 'Parfumerie', soin: 'Soins & skincare', cosmetique: 'Cosmétiques & maquillage', multi: 'Un peu de tout' },
      },
      canal: {
        title: 'Où vendez-vous aujourd’hui ?',
        options: {
          dm: 'Uniquement en messages (Instagram, TikTok, WhatsApp)',
          site: 'J’ai déjà un site (YouCan, Shopify, autre)',
          boutique: 'Boutique physique + réseaux sociaux',
          lancement: 'Je lance ma marque',
        },
      },
      catalogue: {
        title: 'Combien de produits proposez-vous ?',
        options: { s: 'Moins de 20', m: 'Entre 20 et 80', l: 'Plus de 80' },
      },
      commandes: {
        title: 'Combien de commandes recevez-vous par mois ?',
        options: { s: 'Moins de 50', m: 'Entre 50 et 300', l: 'Plus de 300' },
      },
      frustration: {
        title: 'Qu’est-ce qui vous frustre le plus aujourd’hui ?',
        options: {
          dm: 'Je perds des ventes dans les messages',
          image: 'Mon site ne reflète pas le luxe de ma marque',
          panier: 'Mes clientes n’achètent qu’un seul produit',
          unique: 'Je veux écraser la concurrence',
        },
      },
      fonctions: {
        title: 'Qu’est-ce qui vous ferait rêver sur votre site ?',
        options: {
          cod: 'Commande en 1 clic + paiement à la livraison',
          story: 'Fiches produits expertes (notes, ingrédients…)',
          pack: 'Packs et offres « 3 + 1 »',
          avis: 'Avis clientes visibles',
          quiz: 'Un quiz pour guider la cliente',
          bilingue: 'Une version en arabe',
          wow: 'Des animations « waouh »',
          dashboard: 'Un tableau de bord de mes ventes',
        },
      },
      budget: {
        title: 'Quel budget envisagez-vous pour votre site ?',
        options: { s: 'Moins de 2 000 DH', m: 'Entre 2 000 et 4 000 DH', l: 'Plus de 4 000 DH', conseil: 'Je préfère être conseillé(e)' },
      },
      delai: {
        title: 'Quand voulez-vous être en ligne ?',
        options: { urgent: 'Le plus vite possible', mois: 'Dans le mois', flexible: 'Je ne suis pas pressé(e)' },
      },
    } as Record<QuestionId, QuestionContent>,
    comment: {
      title: 'Un mot à nous laisser ?',
      badge: 'Facultatif',
      help: 'Une idée, un site que vous aimez, une contrainte… Tout ce qui nous aide à vous comprendre.',
      placeholder: 'Écrivez ici, ou passez cette étape.',
    },
    contact: {
      title: 'Dernière étape : à qui envoyons-nous votre recommandation ?',
      help: 'Nous vous recontactons sous 24 h avec votre offre et une première idée de maquette.',
      firstName: 'Prénom',
      lastName: 'Nom',
      brand: 'Nom de votre marque',
      phone: 'Téléphone (WhatsApp)',
      phonePlaceholder: '06 12 34 56 78',
      email: 'E-mail',
      emailPlaceholder: 'vous@marque.ma',
      submit: 'Découvrir mon offre',
      privacy: 'Vos données servent uniquement à vous recontacter (loi 09-08). Jamais revendues.',
      errors: { required: 'Champ requis', phone: 'Numéro invalide', email: 'E-mail invalide' },
    },
    sending: 'Analyse de vos réponses…',
    result: {
      eyebrow: 'Votre recommandation',
      hello: 'Merci',
      title: 'L’offre faite pour votre marque :',
      match: 'de compatibilité',
      why: 'Pourquoi cette offre',
      alternative: 'Vous hésitez ? Regardez aussi',
      whatsappCta: 'Recevoir mon offre sur WhatsApp',
      seeOffer: 'Voir le détail de l’offre',
      again: 'Refaire le diagnostic',
      next: 'Notre équipe vous recontacte sous 24 h avec une première maquette à vos couleurs.',
    },
    reasons: {
      'canal.dm': 'Vous vendez en messages : la commande en 1 clic vous rend des heures chaque jour.',
      'canal.site': 'Vous avez déjà un site : il est temps de passer d’un thème générique à une vraie maison.',
      'canal.boutique': 'Votre boutique physique mérite une vitrine en ligne à sa hauteur.',
      'canal.lancement': 'Vous lancez votre marque : démarrez vite, avec un budget maîtrisé.',
      'catalogue.s': 'Votre catalogue est concentré : une vitrine courte et efficace suffit.',
      'catalogue.m': 'Votre catalogue mérite des fiches expertes et des packs.',
      'catalogue.l': 'Un grand catalogue demande une navigation et des outils sur mesure.',
      'commandes.s': 'Chaque commande compte : on supprime toute friction.',
      'commandes.m': 'Avec votre volume, augmenter le panier moyen rapporte vite.',
      'commandes.l': 'À votre volume, chaque point de conversion vaut des milliers de dirhams.',
      'frustration.dm': 'Fini les ventes perdues dans les messages.',
      'frustration.image': 'Votre site doit refléter le luxe de vos produits.',
      'frustration.panier': 'Les packs « 3 + 1 » et l’upsell font grimper le panier moyen.',
      'frustration.unique': 'Vous voulez une expérience que personne d’autre ne propose.',
      'fonctions.cod': 'Le paiement à la livraison en 1 clic est au cœur de l’offre.',
      'fonctions.story': 'Les fiches produits expertes sont incluses.',
      'fonctions.pack': 'Les packs et offres automatiques sont inclus.',
      'fonctions.avis': 'Les avis clientes du Maroc sont inclus.',
      'fonctions.quiz': 'Le quiz interactif est la signature de cette offre.',
      'fonctions.bilingue': 'La version français / arabe est incluse.',
      'fonctions.wow': 'Les animations sur mesure sont incluses.',
      'fonctions.dashboard': 'Le tableau de bord de vos ventes est inclus.',
      'budget.s': 'Elle respecte votre budget.',
      'budget.m': 'Elle correspond exactement à votre budget.',
      'budget.l': 'Votre budget permet une expérience sur mesure complète.',
      'delai.urgent': 'C’est la mise en ligne la plus rapide.',
    } as Record<string, string>,
    whatsapp: (name: string, brand: string, offer: string) =>
      `Bonjour Captivia, je suis ${name} de la marque ${brand}. Mon diagnostic me recommande l’offre « ${offer} ». J’aimerais en savoir plus.`,
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tout ce que vous vous demandez.',
    items: [
      {
        q: 'Pourquoi vos prix sont-ils plus bas que ceux des agences ?',
        a: 'Parce que nous ne faisons que du parfum et de la beauté. Nos fiches produits, nos tunnels de commande et nos packs sont déjà pensés pour votre secteur : vous ne payez pas des semaines de recherche, seulement la personnalisation pour votre marque.',
      },
      {
        q: 'Dois-je payer un abonnement chaque mois ?',
        a: 'Non. Pas d’abonnement de plateforme en dollars, pas d’application COD payante. Seul le nom de domaine reste à renouveler chaque année (quelques centaines de dirhams).',
      },
      {
        q: 'J’ai déjà un site YouCan ou Shopify. Je vais perdre mes produits ?',
        a: 'Non. Nous reprenons vos produits, photos, descriptions et avis clients pour les installer dans votre nouveau site.',
      },
      {
        q: 'Comment fonctionne le paiement à la livraison ?',
        a: 'Votre cliente laisse son nom, son téléphone et sa ville : c’est tout. La commande vous arrive aussitôt sur WhatsApp (ou dans Google Sheets) avec le détail des produits.',
      },
      {
        q: 'Combien de temps faut-il pour être en ligne ?',
        a: 'Dès 5 jours pour l’Essentiel Express, 10 jours pour l’Expérience Olfactive et 3 semaines pour Prestige & Sur-Mesure, à partir de la réception de vos photos et textes.',
      },
      {
        q: 'Je ne sais pas quelle offre choisir.',
        a: 'C’est normal : faites le diagnostic gratuit. En 2 minutes, il vous oriente vers l’offre adaptée, et nous en parlons ensemble sans engagement.',
      },
    ],
  },
  final: {
    title: 'Votre marque mérite d’être captivante.',
    subtitle: 'Faites le diagnostic gratuit et recevez une première maquette à vos couleurs.',
    cta: 'Commencer mon diagnostic',
    whatsapp: 'Discuter sur WhatsApp',
  },
  footer: {
    tagline: 'Atelier e-commerce pour les marques marocaines de parfum et de beauté.',
    rights: 'Tous droits réservés.',
    contact: 'Contact',
    follow: 'Suivez-nous',
    madeIn: 'Conçu au Maroc, avec passion.',
  },
  fab: 'Une question ? Écrivez-nous',
  whatsappHello: 'Bonjour Captivia, j’aimerais un site pour ma marque.',
}

export type Content = typeof fr

const ar: Content = {
  colon: ': ',
  meta: {
    title: 'كابتيفيا — متاجر إلكترونية حسب الطلب لعلامات العطور والتجميل المغربية',
    description:
      'كابتيفيا تصمّم متاجر إلكترونية حسب الطلب لعلامات العطور والعناية والتجميل المغربية: طلب بنقرة واحدة مع الدفع عند الاستلام، صفحات منتجات احترافية، وعروض الباقات. ابتداءً من 1499 درهم.',
  },
  nav: {
    story: 'قصتنا',
    atelier: 'الورشة',
    offers: 'العروض',
    compare: 'المقارنة',
    faq: 'الأسئلة',
    cta: 'تشخيص مجاني',
    switchTo: 'Français',
    menu: 'القائمة',
  },
  hero: {
    eyebrow: 'ورشة متاجر إلكترونية · عطور وتجميل · المغرب',
    titleA: 'علامتكم تُبهر على إنستغرام.',
    titleB: 'وموقعكم يجب أن ',
    titleHighlight: 'يحوّل الإعجاب إلى طلبات.',
    subtitle:
      'كابتيفيا تصمّم معكم متاجر إلكترونية حسب الطلب لعلامات العطور والعناية والتجميل المغربية: واجهة تليق بقواريركم، وطلب بنقرة واحدة مع الدفع عند الاستلام، ومبيعات تصلكم حتى وأنتم نائمون.',
    ctaPrimary: 'صمّموا موقعكم مباشرة',
    ctaSecondary: 'اكتشفوا عرضكم في دقيقتين',
    stats: [
      { value: '1499 درهم', label: 'للانطلاق، بأسعار معلنة' },
      { value: '0 $', label: 'اشتراك شهري في المنصّات' },
      { value: 'نقرة واحدة', label: 'للطلب، والدفع عند الاستلام' },
    ],
    demoBrands: ['دار العود', 'أركان وورد', 'ليالي فاس', 'علامتكم'],
    building: 'موقعكم قيد البناء…',
    scroll: 'اكتشفوا القصة',
  },
  story: {
    eyebrow: 'كان يا ما كان… علامتكم',
    title: 'كل العلامات المغربية الجميلة تعيش القصة نفسها.',
    chapters: [
      {
        kicker: 'الفصل الأول · الشرارة',
        title: 'كل شيء يبدأ بشغف.',
        body:
          'تركيبة عود وورد جُرّبت مئة مرة. زيت أركان اشتُغل عليه حتى بلغ القوام المثالي. ليالٍ في اختيار القارورة والغطاء ولون العلبة. ثم الصورة الأولى على إنستغرام… وقلوب لا تتوقف عن الانهمار.',
      },
      {
        kicker: 'الفصل الثاني · المفارقة',
        title: 'الساعة 23:47. ثمانٍ وثلاثون رسالة غير مقروءة.',
        body:
          'بينما تردّون على زبونة، تكون ثلاث أخريات قد ذهبن إلى المنافس. فتفتحون موقعاً: قالب جاهز يشبه متجر الأدوات المجاور، واشتراك بالدولار، وتطبيق مدفوع للدفع عند الاستلام… وفجأة يبدو عطركم الفاخر كمنتج دروبشيبينغ عادي.',
      },
      {
        kicker: 'الفصل الثالث · لحظة التحوّل',
        title: 'ماذا لو كان موقعكم بجمال قارورتكم؟',
        body:
          'ماذا لو كان يجيب عن «بشحال؟» بدلاً منكم، في الثالثة فجراً؟ هنا تدخل كابتيفيا القصة: ورشة لا تصنع إلا شيئاً واحداً — متاجر إلكترونية لعلامات العطور والتجميل المغربية. لا أزياء ولا أدوات. عالمكم أنتم فقط.',
      },
      {
        kicker: 'الفصل الرابع · التحوّل',
        title: 'زبونتكم تطلب… وأنتم نائمون.',
        body:
          'تصل من قصة على إنستغرام، تكتشف الهرم العطري، تقرأ آراء زبونات من الدار البيضاء إلى وجدة، تختار باقة 3 + 1، وتطلب في 30 ثانية وتدفع عند الاستلام. وفي الصباح، تنتظركم الطلبية على واتساب جاهزة للشحن.',
      },
    ],
    chat: {
      header: 'الرسائل · صفحتكم',
      messages: ['السلام، بشحال هاد العطر؟ 🙏', 'كاين التوصيل لأكادير؟', 'واش كاين 50ml؟', 'شحال كيبقى فالجلد؟', 'ألو؟؟ 😕'],
      seen: 'شوهدت · الزبونة غادرت',
    },
    outroTitle: 'الفصل الخامس · فصلكم أنتم',
    outro: 'بقية قصتكم لا تُكتب بقالب جاهز. بل تُكتب معكم.',
    cta: 'أكتب فصلي',
  },
  atelier: {
    eyebrow: 'ورشة كابتيفيا',
    title: 'صمّموا موقعكم… الآن.',
    subtitle:
      'كل علامة فريدة، وأنتم أصحاب القرار. اكتبوا اسم علامتكم، واختاروا عالمكم وألوانكم وميزاتكم، وشاهدوا النموذج يتحوّل أمام أعينكم. هكذا تماماً سنعمل معاً.',
    steps: ['اسمكم', 'عالمكم', 'ألوانكم', 'خطّكم', 'ميزاتكم'],
    brandLabel: 'اسم علامتكم',
    brandPlaceholder: 'مثال: دار ياسمين',
    universeLabel: 'عالمكم',
    universes: { parfum: 'العطور', soin: 'العناية بالبشرة', cosmetique: 'مستحضرات التجميل' },
    paletteLabel: 'ألوانكم',
    palettes: {
      amethyste: 'الجمشت',
      'noir-or': 'أسود وذهبي',
      rose: 'وردي ناعم',
      oud: 'رمل وعود',
      botanique: 'نباتي',
    },
    fontLabel: 'نوع الخط',
    fonts: { elegante: 'أنيق', editoriale: 'صحفي', moderne: 'عصري' },
    featuresLabel: 'ما يجب أن يقوم به موقعكم',
    features: {
      cod: 'طلب بنقرة + الدفع عند الاستلام',
      story: 'صفحة منتج احترافية',
      pack: 'باقة «اشترِ 3 واحصل على 1 مجاناً»',
      avis: 'آراء زبونات من المغرب',
      quiz: 'اختبار «اكتشفي منتجكم»',
      bilingue: 'نسخة بالفرنسية والعربية',
    },
    cta: 'أريد هذا الموقع — ما هو عرضي؟',
    live: 'معاينة مباشرة',
    note: 'يُرفق نموذجكم بتشخيصكم: ننطلق من اختياراتكم، لا من قالب جاهز.',
  },
  preview: {
    defaultBrand: 'علامتكم',
    menu: ['جديدنا', 'الأكثر مبيعاً', 'العلب'],
    universes: {
      parfum: {
        tagline: 'عطور مستوحاة من المغرب',
        heroTitle: 'فنّ أن تتركي أثراً',
        items: [
          { name: 'عود إمبريال', price: '349 درهم' },
          { name: 'وردة قلعة مكونة', price: '289 درهم' },
        ],
        storyTitle: 'الهرم العطري',
        storyRows: [
          ['المقدمة', 'زعفران · برغموت'],
          ['القلب', 'ورد دمشقي'],
          ['القاعدة', 'عود · عنبر'],
        ],
        quiz: 'اكتشفي عطركِ المميز في 5 أسئلة',
      },
      soin: {
        tagline: 'عناية طبيعية من المغرب',
        heroTitle: 'طقوس بشرتكِ',
        items: [
          { name: 'سيروم أركان الذهبي', price: '259 درهم' },
          { name: 'كريم نيلة', price: '219 درهم' },
        ],
        storyTitle: 'الطقوس والمكوّنات',
        storyRows: [
          ['المكوّن', 'أركان عضوي · فيتامين E'],
          ['البشرة', 'جافة إلى مختلطة'],
          ['الوقت', 'صباحاً ومساءً'],
        ],
        quiz: 'تشخيص بشرتكِ في 5 أسئلة',
      },
      cosmetique: {
        tagline: 'جمال صُمّم في المغرب',
        heroTitle: 'أظهري إشراقتكِ',
        items: [
          { name: 'أحمر شفاه برقوقي', price: '149 درهم' },
          { name: 'بودرة الضوء', price: '189 درهم' },
        ],
        storyTitle: 'الدرجات والثبات',
        storyRows: [
          ['اللمسة', 'مطفأة مخملية'],
          ['الثبات', 'حتى 12 ساعة'],
          ['الدرجات', '8 درجات'],
        ],
        quiz: 'اكتشفي درجتكِ المثالية في 5 أسئلة',
      },
    },
    newIn: 'جديد',
    pack: 'اشترِ 3 واحصل على 1 مجاناً',
    packSub: 'أضيفي منتجاً واحداً لتحصلي على الهدية',
    reviews: '4.9/5 · 312 رأياً من المغرب',
    reviewQuote: '«وصلني في 24 ساعة إلى الرباط، ثبات رائع!»',
    cod: 'اطلبي الآن · الدفع عند الاستلام',
    codSub: 'الاسم، الهاتف، المدينة — هذا كل شيء.',
    discover: 'اكتشفي',
  },
  compare: {
    eyebrow: 'المقارنة',
    title: 'لماذا تخسر علامات جميلة كثيرة مبيعاتها على الإنترنت؟',
    subtitle:
      'درسنا عروض وكالات الويب المغربية ومتاجر علامات العطور والتجميل. إليكم ما وجدناه — وما تفعله كابتيفيا بشكل مختلف.',
    columns: ['الوكالات العامة', 'قالب تصنعونه بأنفسكم', 'كابتيفيا'],
    rows: [
      {
        label: 'سعر المتجر',
        a: 'من 4500 إلى 17900 درهم، وغالباً «حسب الطلب»',
        b: 'مجاني في البداية… ثم قالب وتطبيقات واشتراك',
        c: 'من 1499 إلى 4999 درهم، أسعار ثابتة ومعلنة',
      },
      {
        label: 'الاشتراك الشهري',
        a: 'المنصّة على حسابكم، أحياناً بالدولار',
        b: 'نعم، ويرتفع مع كل تطبيق',
        c: 'بدون أي اشتراك في المنصّات',
      },
      {
        label: 'التخصّص',
        a: 'أزياء، مجوهرات، أثاث، أدوات…',
        b: 'لا يوجد',
        c: '100% عطور وعناية وتجميل',
      },
      {
        label: 'صفحة المنتج',
        a: 'صورة وسعر ووصف عادي',
        b: 'صفحة القالب، مثل الجميع',
        c: 'الهرم العطري، الثبات، المكوّنات، الطقوس',
      },
      {
        label: 'الدفع عند الاستلام',
        a: 'عبر تطبيقات خارجية غالباً مدفوعة',
        b: 'مسار طويل وإنشاء حساب',
        c: 'مدمج، بنقرة واحدة، ومرتبط بواتساب',
      },
      {
        label: 'مدة الإطلاق',
        a: 'من أسبوعين إلى 10 أسابيع',
        b: 'أسابيع من المحاولات كل مساء',
        c: 'ابتداءً من 5 أيام',
      },
      {
        label: 'صورة العلامة',
        a: 'قالب معدّل قليلاً',
        b: 'نفس القالب لآلاف المتاجر',
        c: 'هوية حسب الطلب ونموذج نعتمده معكم',
      },
    ],
    source: 'أرقام مأخوذة من صفحات الأسعار العامة لوكالات ويب مغربية، نونبر 2026.',
  },
  offers: {
    eyebrow: 'عروضنا الثلاثة',
    title: 'عرض لكل مرحلة من مراحل علامتكم.',
    subtitle: 'أسعار ثابتة ومعلنة، وأقل بكثير من السوق. تعرفون ما ستدفعونه قبل أن تتحدثوا معنا.',
    currency: 'درهم',
    oneTime: 'دفعة واحدة',
    popular: 'الأكثر طلباً',
    idealFor: 'لمن هذا العرض',
    need: 'حاجتكم',
    included: 'ما يتضمّنه العرض',
    cta: 'هل هذا هو عرضي؟',
    market: 'سعر السوق',
    items: {
      essentiel: {
        name: 'الأساسي السريع',
        tag: 'نقطة الانطلاق',
        price: '1499',
        market: '2500 درهم فأكثر',
        idealFor: 'العلامات التي تبيع عبر إنستغرام أو تيك توك أو واتساب وتخسر مبيعات بسبب تأخر الرد.',
        need: 'التوقف عن الرد على «بشحال؟» طوال اليوم، وأتمتة استقبال الطلبات دون تنفير الزبونة المغربية.',
        features: [
          'صفحة هبوط فائقة السرعة، مصمّمة للهاتف أولاً',
          'كتالوج حتى 20 منتجاً',
          'استمارة دفع عند الاستلام بنقرة واحدة (الاسم، الهاتف، المدينة) مرتبطة بواتساب',
          'بدون إنشاء حساب وبدون سلة معقّدة',
          'تصميم راقٍ بروح الفخامة وبألوانكم',
        ],
        delay: 'إطلاق ابتداءً من 5 أيام',
      },
      experience: {
        name: 'التجربة العطرية',
        tag: 'الأكثر مبيعاً',
        price: '2899',
        market: 'من 4000 إلى 6000 درهم',
        idealFor: 'العلامات الموجودة على YouCan أو Shopify التي تريد الخروج من القوالب العادية ورفع قيمة السلة.',
        need: 'موقع يبدو «دار فخامة حقيقية» وبيع منتجات أكثر لكل زبونة.',
        features: [
          'كل ما في الأساسي السريع',
          'صفحات منتجات احترافية: الهرم العطري (المقدمة، القلب، القاعدة)، الشدّة، الموسم — أو المكوّنات والطقوس لمنتجات العناية',
          'بيع إضافي تلقائي: «اشترِ 3 واحصل على 1 مجاناً»، باقات اكتشاف، علب هدايا',
          'آراء حقيقية لزبونات من المغرب كدليل اجتماعي',
          'كتالوج موسّع ونقل منتجاتكم الحالية',
        ],
        delay: 'إطلاق خلال 10 أيام',
      },
      prestige: {
        name: 'البريستيج حسب الطلب',
        tag: 'عرض الريادة',
        price: '4999',
        market: '10000 درهم فأكثر',
        idealFor: 'العلامات الطموحة التي تريد تجربة تليق بكبرى دور العطور.',
        need: 'التفوّق في سوقكم بتقنية متقدّمة وتجربة لا تُنسى للزبونة.',
        features: [
          'كل ما في التجربة العطرية',
          'موقع حسب الطلب فائق السرعة (React / Vite)',
          'اختبار تفاعلي «اكتشفي عطركِ المميز في 5 أسئلة» أو تشخيص البشرة',
          'حركات سلسة لتأثير مُبهر',
          'نسخة بالفرنسية والعربية',
          'لوحة تحكم وتتبّع التحويلات',
        ],
        delay: 'إطلاق خلال 3 أسابيع',
      },
    },
    guaranteesTitle: 'مشمول في كل العروض',
    guarantees: [
      'نموذج نعتمده معكم قبل البرمجة',
      'الموقع واسم النطاق باسمكم',
      'نقل منتجاتكم وصوركم وآراء زبوناتكم',
      'تدريب لتسيير طلباتكم باستقلالية',
      'الدفع على مرحلتين: 50% عند الانطلاق و50% عند الإطلاق',
    ],
  },
  method: {
    eyebrow: 'المنهجية',
    title: 'من فكرتكم إلى أول طلبية.',
    steps: [
      { title: 'التشخيص', body: 'دقيقتان لفهم علامتكم ومبيعاتكم واحتياجاتكم الحقيقية.' },
      { title: 'النموذج', body: 'خلال 48 ساعة ترون موقعكم بألوانكم. تعدّلون ونحن نحسّن.' },
      { title: 'الإنجاز', body: 'نبني الموقع، ندمج منتجاتكم ونربط الطلبات بواتساب.' },
      { title: 'الإطلاق', body: 'نشر الموقع، تدريب، ورابطكم جاهز للبايو وللإعلانات.' },
    ],
  },
  diagnostic: {
    eyebrow: 'تشخيص مجاني · دقيقتان',
    title: 'أيّ عرض يناسب علامتكم؟',
    subtitle:
      'أجيبوا عن بضعة أسئلة: كل إجابة تُظهر السؤال التالي. في النهاية نقترح عليكم العرض الذي يلبّي احتياجاتكم فعلاً — دون أي التزام.',
    start: 'ابدؤوا التشخيص',
    duration: '8 أسئلة · دقيقتان',
    question: 'السؤال',
    of: 'من',
    back: 'رجوع',
    next: 'متابعة',
    skip: 'تخطّي',
    multiHint: 'يمكن اختيار أكثر من إجابة',
    keyHint: 'نصيحة: اضغطوا A أو B أو C… للإجابة',
    interested: (offer: string) => `تهتمون بعرض «${offer}»: سيتحقّق التشخيص من أنه العرض المناسب لكم.`,
    questions: {
      univers: {
        title: 'ما هو عالم علامتكم؟',
        options: { parfum: 'العطور', soin: 'العناية بالبشرة', cosmetique: 'التجميل والمكياج', multi: 'القليل من كل شيء' },
      },
      canal: {
        title: 'أين تبيعون اليوم؟',
        options: {
          dm: 'فقط عبر الرسائل (إنستغرام، تيك توك، واتساب)',
          site: 'لديّ موقع (YouCan أو Shopify أو غيرهما)',
          boutique: 'متجر فعلي + شبكات التواصل',
          lancement: 'أنا بصدد إطلاق علامتي',
        },
      },
      catalogue: {
        title: 'كم عدد منتجاتكم؟',
        options: { s: 'أقل من 20', m: 'بين 20 و80', l: 'أكثر من 80' },
      },
      commandes: {
        title: 'كم طلبية تستقبلون في الشهر؟',
        options: { s: 'أقل من 50', m: 'بين 50 و300', l: 'أكثر من 300' },
      },
      frustration: {
        title: 'ما الذي يزعجكم أكثر اليوم؟',
        options: {
          dm: 'أخسر مبيعات في الرسائل',
          image: 'موقعي لا يعكس فخامة علامتي',
          panier: 'زبوناتي يشترين منتجاً واحداً فقط',
          unique: 'أريد التفوّق على المنافسين',
        },
      },
      fonctions: {
        title: 'ما الذي تحلمون به في موقعكم؟',
        options: {
          cod: 'طلب بنقرة + الدفع عند الاستلام',
          story: 'صفحات منتجات احترافية (النوتات، المكوّنات…)',
          pack: 'باقات وعروض «3 + 1»',
          avis: 'آراء الزبونات ظاهرة',
          quiz: 'اختبار يرشد الزبونة',
          bilingue: 'نسخة بالعربية',
          wow: 'حركات مُبهرة',
          dashboard: 'لوحة تحكم لمبيعاتي',
        },
      },
      budget: {
        title: 'ما الميزانية التي تفكرون فيها لموقعكم؟',
        options: { s: 'أقل من 2000 درهم', m: 'بين 2000 و4000 درهم', l: 'أكثر من 4000 درهم', conseil: 'أفضّل أن تنصحوني' },
      },
      delai: {
        title: 'متى تريدون إطلاق موقعكم؟',
        options: { urgent: 'في أقرب وقت', mois: 'خلال هذا الشهر', flexible: 'لا داعي للاستعجال' },
      },
    },
    comment: {
      title: 'هل تودّون ترك كلمة لنا؟',
      badge: 'اختياري',
      help: 'فكرة، موقع يعجبكم، أو قيد معيّن… كل ما يساعدنا على فهمكم.',
      placeholder: 'اكتبوا هنا، أو تخطّوا هذه الخطوة.',
    },
    contact: {
      title: 'الخطوة الأخيرة: لمن نرسل توصيتكم؟',
      help: 'نتواصل معكم خلال 24 ساعة بعرضكم وفكرة أولى عن النموذج.',
      firstName: 'الاسم الشخصي',
      lastName: 'الاسم العائلي',
      brand: 'اسم علامتكم',
      phone: 'الهاتف (واتساب)',
      phonePlaceholder: '06 12 34 56 78',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'you@brand.ma',
      submit: 'اكتشاف عرضي',
      privacy: 'تُستعمل بياناتكم فقط للتواصل معكم (القانون 09-08). ولا تُباع أبداً.',
      errors: { required: 'حقل مطلوب', phone: 'رقم غير صالح', email: 'بريد غير صالح' },
    },
    sending: 'جارٍ تحليل إجاباتكم…',
    result: {
      eyebrow: 'توصيتكم',
      hello: 'شكراً',
      title: 'العرض المناسب لعلامتكم:',
      match: 'نسبة التوافق',
      why: 'لماذا هذا العرض',
      alternative: 'مترددون؟ اطّلعوا أيضاً على',
      whatsappCta: 'أريد عرضي على واتساب',
      seeOffer: 'تفاصيل العرض',
      again: 'إعادة التشخيص',
      next: 'يتواصل معكم فريقنا خلال 24 ساعة بنموذج أول بألوانكم.',
    },
    reasons: {
      'canal.dm': 'تبيعون عبر الرسائل: الطلب بنقرة واحدة يوفّر عليكم ساعات كل يوم.',
      'canal.site': 'لديكم موقع: حان وقت الانتقال من قالب عادي إلى دار حقيقية.',
      'canal.boutique': 'متجركم الفعلي يستحق واجهة إلكترونية في مستواه.',
      'canal.lancement': 'تطلقون علامتكم: انطلقوا بسرعة وبميزانية مضبوطة.',
      'catalogue.s': 'كتالوجكم مركّز: واجهة قصيرة وفعّالة تكفي.',
      'catalogue.m': 'كتالوجكم يستحق صفحات احترافية وباقات.',
      'catalogue.l': 'الكتالوج الكبير يحتاج تصفّحاً وأدوات حسب الطلب.',
      'commandes.s': 'كل طلبية مهمة: نزيل كل العوائق.',
      'commandes.m': 'بحجم طلباتكم، رفع قيمة السلة يعطي نتائج سريعة.',
      'commandes.l': 'بحجمكم، كل نقطة تحويل تساوي آلاف الدراهم.',
      'frustration.dm': 'وداعاً للمبيعات الضائعة في الرسائل.',
      'frustration.image': 'موقعكم يجب أن يعكس فخامة منتجاتكم.',
      'frustration.panier': 'باقات «3 + 1» والبيع الإضافي ترفع قيمة السلة.',
      'frustration.unique': 'تريدون تجربة لا يقدّمها أحد غيركم.',
      'fonctions.cod': 'الدفع عند الاستلام بنقرة واحدة في قلب هذا العرض.',
      'fonctions.story': 'صفحات المنتجات الاحترافية مشمولة.',
      'fonctions.pack': 'الباقات والعروض التلقائية مشمولة.',
      'fonctions.avis': 'آراء زبونات المغرب مشمولة.',
      'fonctions.quiz': 'الاختبار التفاعلي هو بصمة هذا العرض.',
      'fonctions.bilingue': 'النسخة الفرنسية والعربية مشمولة.',
      'fonctions.wow': 'الحركات المصمّمة حسب الطلب مشمولة.',
      'fonctions.dashboard': 'لوحة تحكم المبيعات مشمولة.',
      'budget.s': 'يحترم ميزانيتكم.',
      'budget.m': 'يطابق ميزانيتكم تماماً.',
      'budget.l': 'ميزانيتكم تسمح بتجربة كاملة حسب الطلب.',
      'delai.urgent': 'إنه أسرع إطلاق ممكن.',
    },
    whatsapp: (name: string, brand: string, offer: string) =>
      `السلام عليكم كابتيفيا، أنا ${name} من علامة ${brand}. أوصاني التشخيص بعرض «${offer}». أودّ معرفة المزيد.`,
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'كل ما تتساءلون عنه.',
    items: [
      {
        q: 'لماذا أسعاركم أقل من الوكالات؟',
        a: 'لأننا لا نعمل إلا في العطور والتجميل. صفحات المنتجات ومسارات الطلب والباقات جاهزة ومدروسة لقطاعكم: لا تدفعون أسابيع من البحث، بل فقط التخصيص لعلامتكم.',
      },
      {
        q: 'هل عليّ دفع اشتراك كل شهر؟',
        a: 'لا. لا اشتراك في منصّات بالدولار، ولا تطبيق مدفوع للدفع عند الاستلام. يبقى فقط تجديد اسم النطاق كل سنة (بضع مئات من الدراهم).',
      },
      {
        q: 'لديّ موقع على YouCan أو Shopify. هل سأفقد منتجاتي؟',
        a: 'لا. ننقل منتجاتكم وصوركم وأوصافكم وآراء زبوناتكم إلى موقعكم الجديد.',
      },
      {
        q: 'كيف يعمل الدفع عند الاستلام؟',
        a: 'تترك زبونتكم اسمها وهاتفها ومدينتها فقط. وتصلكم الطلبية فوراً على واتساب (أو في Google Sheets) مع تفاصيل المنتجات.',
      },
      {
        q: 'كم من الوقت يلزم للإطلاق؟',
        a: 'ابتداءً من 5 أيام للأساسي السريع، و10 أيام للتجربة العطرية، و3 أسابيع للبريستيج حسب الطلب، بعد استلام صوركم ونصوصكم.',
      },
      {
        q: 'لا أعرف أي عرض أختار.',
        a: 'هذا طبيعي: قوموا بالتشخيص المجاني. في دقيقتين يوجّهكم إلى العرض المناسب، ونتحدث عنه معاً دون أي التزام.',
      },
    ],
  },
  final: {
    title: 'علامتكم تستحق أن تكون آسرة.',
    subtitle: 'قوموا بالتشخيص المجاني واستلموا نموذجاً أول بألوانكم.',
    cta: 'ابدؤوا التشخيص',
    whatsapp: 'تحدّثوا معنا على واتساب',
  },
  footer: {
    tagline: 'ورشة متاجر إلكترونية لعلامات العطور والتجميل المغربية.',
    rights: 'جميع الحقوق محفوظة.',
    contact: 'تواصل',
    follow: 'تابعونا',
    madeIn: 'صُمّم في المغرب، بشغف.',
  },
  fab: 'سؤال؟ راسلونا',
  whatsappHello: 'السلام عليكم كابتيفيا، أريد موقعاً لعلامتي.',
}

export const content: Record<Lang, Content> = { fr, ar }
