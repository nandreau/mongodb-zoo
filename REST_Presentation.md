# **Présentation du concept des API REST**

## Qu'est-ce qu'une API ?

- Acronyme d'*Application Programming Interface*
- Interface de communication et d'échanges de données entre applications
- Accède aux fonctions et données des individualités en lien

## Qu'est-ce qu'une API dite REST ?

- Acronyme de *Representational State Transfer*
- Style d'architecture indépendant de protocoles
- Suit différents principes qui la définissent

### Quels sont les principes REST ?

- Interface uniforme : 
  - les requêtes pour une même ressource sont identiques
  - chaque donnée appartient à un unique URI (*uniform resource identifier*)
- Indépendance client-serveur : les applications client et serveur ne communiquent qu'à travers les URI.
- Utilise un modèle de requête sans état = requêtes HTTP indépendantes et ne suivent pas d'ordre
- Architecture en système de couches : les requêtes et réponses passent par plusieurs couches, faisant en sorte que ni le client ni le serveur ne peut savoir s'ils communiquement avec l'interlocuteur ou un intermédiaire.

### Quels sont les avantages de la méthode REST dans une web app ?

- Les API REST sont indépendantes de la plateforme et du langage, ce qui apporte plus de liberté dans les échanges de données.
- Les API REST sont auto-documentées ; de plus des outils permettent la génération de la documentation de l'API.
- Elles peuvent être améliorées en ajoutant des fonctionnalités sans déteriorées celles déjà présentes
- Les API REST peuvent être sécurisées avec de protocoles type HTTPS. Il ets possible d'ajouter des systèmes d'authentification.
- Les API REST sont souvent utilisées pour intégrer des services tiers pour ajouter des fonctionnalités à l'application.

