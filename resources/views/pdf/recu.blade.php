<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu ELITE SPORT</title>
    <style>
        body { font-family: 'Georgia', serif; color: #111; margin: 0; padding: 30px; }
        .header { text-align: center; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; letter-spacing: 4px; }
        .gold { color: #c9a84c; }
        .content { margin-top: 40px; }
        .details { width: 100%; margin-top: 30px; border-collapse: collapse; }
        .details td { padding: 15px; border-bottom: 1px solid #eee; }
        .label { color: #888; font-size: 12px; text-transform: uppercase; }
        .footer { margin-top: 100px; text-align: center; font-size: 10px; color: #bbb; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">ELITE<span class="gold">SPORT</span></div>
        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px;">Reçu de Paiement Officiel</p>
    </div>

    <div class="content">
        <table class="details">
            <tr>
                <td class="label">Client</td>
                <td><strong>{{ $abonnement->user->prenom }} {{ $abonnement->user->nom }}</strong></td>
            </tr>
            <tr>
                <td class="label">Abonnement</td>
                <td>Formule {{ $abonnement->formule->nom }}</td>
            </tr>
            <tr>
                <td class="label">Montant Réglé</td>
                <td style="font-size: 20px;"><strong>{{ number_format($abonnement->formule->prix, 2) }} DH</strong></td>
            </tr>
            <tr>
                <td class="label">Date du paiement</td>
                <td>{{ $abonnement->created_at->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Valide jusqu'au</td>
                <td>{{ \Carbon\Carbon::parse($abonnement->date_fin)->format('d/m/Y') }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">ELITE SPORT LUXURY FITNESS - DOCUMENT GÉNÉRÉ AUTOMATIQUEMENT</div>
</body>
</html>