<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailAcceptationCoach extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Félicitations : Bienvenue dans l\'équipe des Coachs !')
                    ->html("
                        <div style='font-family: sans-serif; line-height: 1.6;'>
                            <h2 style='color: #2563eb;'>Excellente nouvelle {$this->user->prenom} !</h2>
                            <p>L'administration a examiné votre candidature et nous avons le plaisir de vous annoncer que vous êtes officiellement membre de notre équipe de <strong>Coachs</strong>.</p>
                            <p>Votre profil a été mis à jour. Vous pouvez dès maintenant gérer vos disponibilités et vos séances depuis votre tableau de bord.</p>
                            <p>Bienvenue parmi nous !</p>
                            <hr>
                            <p><strong>Elite Sport Administration</strong></p>
                        </div>
                    ");
    }
}