<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailConfirmationAbonnement extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Confirmation de votre abonnement - Elite Sport')
                    ->html("
                        <div style='font-family: sans-serif; line-height: 1.6;'>
                            <h2 style='color: #16a34a;'>Félicitations {$this->user->prenom} !</h2>
                            <p>Votre paiement a bien été reçu et votre abonnement est désormais <strong>ACTIF</strong>.</p>
                            <p>Vous avez maintenant accès à l'ensemble de nos installations et aux séances de sport réservées aux membres.</p>
                            <p>Merci de votre confiance et bon entraînement !</p>
                            <br>
                            <p style='font-size: 12px; color: #666;'>Ceci est une confirmation automatique de transaction.</p>
                        </div>
                    ");
    }
}