import { Link } from 'react-router-dom';
import { Section, TitreSection, BoutonInterne } from './blocs';
import { BlocContactProfils } from './ProfilsContact';
import type { Profil } from '@content/profils';
import { cartesPlusLoinDefaut, type ServiceAide, type CartePlusLoin } from '@content/aide';

// « Des services pour vous aider » — liste de services pertinents à côté d'un outil.
export function BlocServicesAide({
  titre = 'Des services pour vous aider',
  intro = 'Au-delà du calcul, je peux vous accompagner concrètement.',
  services,
}: {
  titre?: string;
  intro?: string;
  services: ServiceAide[];
}) {
  if (!services.length) return null;
  return (
    <div className="rt-aide">
      <h3 className="rt-aide__titre">{titre}</h3>
      <p className="rt-aide__intro">{intro}</p>
      <div className="rt-aide__liste">
        {services.map((s) => (
          <Link key={s.href} to={s.href} className="rt-aide__item">
            <span className="rt-aide__icone" aria-hidden="true">✦</span>
            <div>
              <h4>{s.titre}</h4>
              <p>{s.texte}</p>
            </div>
            <span className="rt-aide__fleche" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// « Pour aller plus loin / faire affaire avec Roxan ».
export function BlocAllerPlusLoin({ cartes = cartesPlusLoinDefaut }: { cartes?: CartePlusLoin[] }) {
  return (
    <div className="rt-plus-loin">
      {cartes.map((c) => (
        <div key={c.titre} className="rt-plus-loin__carte">
          <h3>{c.titre}</h3>
          <p>{c.texte}</p>
          <BoutonInterne href={c.bouton.href} variante="secondaire">{c.bouton.libelle}</BoutonInterne>
        </div>
      ))}
    </div>
  );
}

// Pied de page « outil/guide » complet : services d'aide + profils à contacter
// (formulaire pré-rempli) + aller plus loin. Réutilisé sur les calculateurs et
// les guides pour ne jamais laisser l'utilisateur seul devant un outil.
export function BlocAideOutil({
  aide,
  profils,
  typeFormulaire,
  pageOrigine,
  etiquettes,
  sourceEntite,
  titreContact = 'Une question ? Parlez à la bonne personne',
  introContact = 'Choisissez la personne à contacter : votre demande lui est transmise directement.',
  plusLoin,
}: {
  aide: ServiceAide[];
  profils: Profil[];
  typeFormulaire: string;
  pageOrigine: string;
  etiquettes: string[];
  sourceEntite?: string;
  titreContact?: string;
  introContact?: string;
  plusLoin?: CartePlusLoin[];
}) {
  return (
    <>
      {aide.length > 0 && (
        <Section variante="ivoire">
          <BlocServicesAide services={aide} />
        </Section>
      )}

      {profils.length > 0 && (
        <Section variante="creme">
          <TitreSection eyebrow="Contact" titre={titreContact} description={introContact} />
          <BlocContactProfils
            profils={profils}
            typeFormulaire={typeFormulaire}
            pageOrigine={pageOrigine}
            etiquettes={etiquettes}
            sourceEntite={sourceEntite}
            titre="Demander à être recontacté"
          />
        </Section>
      )}

      <Section variante="ivoire">
        <TitreSection eyebrow="Pour aller plus loin" titre="Faire affaire avec Roxan" />
        <BlocAllerPlusLoin cartes={plusLoin} />
      </Section>
    </>
  );
}
