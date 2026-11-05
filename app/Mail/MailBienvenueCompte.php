<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailBienvenueCompte extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Bienvenue chez Elite Sport !')
                    ->html("
                        <div style='font-family: sans-serif; line-height: 1.6;'>
                            <h2 style='color: #d97706;'>Bonjour {$this->user->prenom} !</h2>
                            <p>Nous sommes ravis de vous accueillir au sein de la communauté <strong>Elite Sport</strong>.</p>
                            <p>Votre compte a été créé avec succès. Vous pouvez désormais explorer nos différentes disciplines et choisir la formule qui vous convient.</p>
                            <p>À très bientôt dans nos salles !</p>
                            <hr>
                            <small>L'équipe Elite Sport</small>
                        </div>
                    ");
    }
}