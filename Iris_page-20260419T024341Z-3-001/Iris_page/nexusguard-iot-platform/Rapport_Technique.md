# Rapport Technique : Plateforme IoT NexusGuard
**Village Mini - ENIF 6.0 (IEEE ENIS 2026)**

---

## 1. Introduction
Le projet **NexusGuard Village Mini** est une solution IoT professionnelle pour le monitoring et la gestion automatisée du Nexus **Water-Energy-Food (WEF)**. Il s'agit d'un système intelligent capable de gérer l'irrigation d'une parcelle tout en surveillant les ressources critiques.

## 2. Architecture Matérielle
Le système est conçu pour fonctionner sur un **Raspberry Pi** avec les composants suivants :

| Composant | Rôle | Interface/GPIO |
| :--- | :--- | :--- |
| **DHT22** | Température & Humidité Air | GPIO 17 |
| **HC-SR04** | Niveau d'eau (Ultrason) | TRIG=23, ECHO=24 |
| **ADS1115** | ADC pour Humidité Sol | I2C (Canal 0) |
| **Relais** | Pompe à eau | GPIO 18 (Inv) |

## 3. Architecture Logicielle
La plateforme utilise une architecture moderne et réactive :

- **Backend (Python/Flask) :**
    - `app.py` : Serveur web et WebSocket (SocketIO).
    - `main.py` : Boucle de contrôle et logique de décision Nexus.
    - `config.py` : Paramètres de configuration (seuils, pins).
- **Frontend (Web Dashboard) :**
    - Interface responsive avec **Bootstrap 5**.
    - Visualisation en temps réel via **WebSockets**.
    - Graphiques historiques avec **Chart.js**.

## 4. Logique de Décision Nexus (WEF)
L'intelligence du système repose sur la logique WEF qui valide 3 conditions avant d'activer la pompe :

1. **FOOD (Sol) :** L'humidité du sol doit être basse (inférieure au seuil, par défaut **40%**).
2. **WATER (Eau) :** Le réservoir doit contenir assez d'eau (supérieur à **20%**) pour éviter d'endommager la pompe.
3. **ENERGY (Surchauffe) :** La température ambiante doit être sûre (inférieure à **45°C**).

**Résultat :** La pompe ne démarre que si les 3 conditions sont réunies (en mode Automatique).

## 5. Fonctionnalités du Dashboard
- **Monitoring Temps Réel :** Affichage instantané de la température, humidité et niveau d'eau.
- **Contrôle de Mode :** Passage du mode "Automatique" au mode "Manuel".
- **Contrôle Manuel :** Activation/Désactivation forcée de la pompe.
- **Historique :** Graphique des 30 dernières minutes.
- **Paramétrage :** Modification des seuils (Sol, Eau, Temp) directement depuis l'interface.

## 6. Conclusion
NexusGuard Village Mini démontre l'efficacité de l'IoT pour l'agriculture de précision. En combinant protection matérielle et optimisation des ressources, le système offre une autonomie fiable et sécurisée.
