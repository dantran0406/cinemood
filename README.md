# cinemood
Ce site web a été créé pour visualiser les films selon leurs émotions dominantes et leurs notes IMDb.        Vous pouvez filtrer les films par émotion, trier par année ou par note, et explorer les informations        détaillées de chaque film en survolant les posters. L'objectif est de rendre la découverte de films plus intuitive et amusante.
## Visualiser le projet

Le projet peut être visualisé de deux façons :

1. **GitHub Pages** :  
   Le site est hébergé sur GitHub Pages et accessible via un lien direct, par exemple :  
   `https://dantran0406.github.io/cinemood/`

2. **Localement** :  
   Pour tester le projet sur votre ordinateur :
   - Ouvrez VS Code et installez l'extension **Live Server**, puis faites un clic droit sur `index.html → Open with Live Server`.
   - Ou utilisez Node.js pour lancer un serveur local :  
     ```bash
     npx serve .
     ```
   - Ensuite, ouvrez votre navigateur à l'adresse affichée (par exemple `http://localhost:5000`).

> Remarque : Ouvrir directement `index.html` sans serveur peut provoquer des erreurs à cause de restrictions CORS pour le fichier `movies.json`.
