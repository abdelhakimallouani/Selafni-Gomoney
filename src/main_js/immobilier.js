document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('saiser-form');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');

    // Fonction pour calculer les resultats du pret
    function calculerPret(montant, dureeAnnees, typePret, salaire) {
        let tauxBase;

        switch (typePret) {
            case 'maison':
                tauxBase = 3.5;
                break;
            case 'appartement':
                tauxBase = 4.0;
                break;
            case 'terrain':
                tauxBase = 5.0;
                break;
            default:
                tauxBase = 4.0;
        }

        // Ajustement du taux en fonction de la duree
        let tauxFinal = tauxBase + (dureeAnnees > 15 ? (dureeAnnees - 15) * 0.1 : 0);
        tauxFinal = Math.min(tauxFinal, 8.0);

        // Conversion en taux mensuel
        const tauxMensuel = tauxFinal / 100 / 12;
        const nbMois = dureeAnnees * 12;

        // Calcul de la mensualite
        const mensualite = montant * tauxMensuel * Math.pow(1 + tauxMensuel, nbMois) /
            (Math.pow(1 + tauxMensuel, nbMois) - 1);

        // Calcul du total à rembourser et des interets
        const totalRembourse = mensualite * nbMois;
        const totalInterets = totalRembourse - montant;

        // Calcul du pourcentage du salaire
        const pourcentageSalaire = salaire > 0 ? (mensualite / salaire) * 100 : 0;

        return {
            mensualite: mensualite,
            totalRembourse: totalRembourse,
            totalInterets: totalInterets,
            tauxFinal: tauxFinal,
            pourcentageSalaire: pourcentageSalaire,
            nbMois: nbMois
        };
    }



    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Recuperation des valeurs du formulaire
        const typePret = document.getElementById('type').value;
        const montant = parseFloat(document.getElementById('montant').value);
        const dureeAnnees = parseFloat(document.getElementById('duree').value);
        const salaire = parseFloat(document.getElementById('salaire').value);


        // Calcul des resultats
        const resultats = calculerPret(montant, dureeAnnees, typePret, salaire);

        // Verification si le pret est accessible
        const pretAccessible = resultats.pourcentageSalaire <= 40;

        let html = '';

        if (pretAccessible) {
            // Pret accessible
            html = `
                        <div class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-green-600 mb-2">Pret Accessible !</h1>
                            <p class="text-lg text-gray-700">Votre mensualite represente <span class="font-bold text-blue-600">${resultats.pourcentageSalaire.toFixed(1)}%</span> de votre salaire</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p class="text-gray-500 text-sm">Type de pret</p>
                                <p class="font-bold">${typePret.charAt(0).toUpperCase() + typePret.slice(1)}</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Montant demande</p>
                                <p class="font-bold">${montant.toFixed(2)} DH</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Duree</p>
                                <p class="font-bold">${resultats.nbMois} mois (${dureeAnnees} ans)</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Taux applique</p>
                                <p class="font-bold">${resultats.tauxFinal.toFixed(2)}%</p>
                            </div>
                        </div>

                        <div class="text-center mb-6">
                            <p class="text-gray-500 text-sm">Mensualite</p>
                            <p class="text-4xl font-bold text-blue-700">${resultats.mensualite.toFixed(2)} DH</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p class="text-gray-500 text-sm">Total des interets</p>
                                <p class="font-bold">${resultats.totalInterets.toFixed(2)} DH</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Montant total à rembourser</p>
                                <p class="font-bold">${resultats.totalRembourse.toFixed(2)} DH</p>
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <p class="text-green-700 font-semibold">Excellent ! Ce pret est adapte à vos revenus</p>
                                <p class="text-green-600 text-sm">Votre taux d'endettement de <span>${resultats.pourcentageSalaire.toFixed(1)}%</span> reste sous la limite recommandee de 40%.</p>
                            </div>
                        </div>
                    `;
        } else {
            // Pret non accessible
            html = `
                        <div class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-red-600 mb-2">Pret Pas Accessible !</h1>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p class="text-gray-500 text-sm">Type de pret</p>
                                <p class="font-bold">${typePret.charAt(0).toUpperCase() + typePret.slice(1)}</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Montant demande</p>
                                <p class="font-bold">${montant.toFixed(2)} DH</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Duree</p>
                                <p class="font-bold">${resultats.nbMois} mois (${dureeAnnees} ans)</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Taux applique</p>
                                <p class="font-bold">${resultats.tauxFinal.toFixed(2)}%</p>
                            </div>
                        </div>

                        <div class="text-center mb-6">
                            <p class="text-gray-500 text-sm">Mensualite</p>
                            <p class="text-4xl font-bold text-red-700">${resultats.mensualite.toFixed(2)} DH</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p class="text-gray-500 text-sm">Total des interets</p>
                                <p class="font-bold">${resultats.totalInterets.toFixed(2)} DH</p>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm">Montant total à rembourser</p>
                                <p class="font-bold">${resultats.totalRembourse.toFixed(2)} DH</p>
                            </div>
                        </div>

                        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p class="text-red-700 font-semibold text-center">Ce pret depasse votre capacite d'emprunt</p>
                        </div>

                        <div class="mb-6">
                            <p class="font-semibold text-gray-700 mb-2">Pour rendre ce pret accessible, vous pouvez :</p>
                            <ul class="list-disc pl-5 text-gray-600">
                                <li>Augmenter la duree de remboursement</li>
                                <li>Reduire le montant emprunte</li>
                                <li>Ameliorer votre capacite de remboursement</li>
                            </ul>
                        </div>
                    `;
        }

        // changer le contenu
        resultContent.innerHTML = html;

        // Affichage de la section resultats et masquage du formulaire
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
});