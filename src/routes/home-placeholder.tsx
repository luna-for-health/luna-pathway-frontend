import { useState } from 'react';

import {
  Alert,
  Avatar,
  Badge,
  BadgeNotification,
  Button,
  Card,
  Chip,
  Dialog,
  Dropdown,
  Field,
  FilterChip,
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  Option,
  OptionList,
  Radio,
  RadioGroup,
  SearchBar,
  Select,
  Sheet,
  Switch,
  Tabs,
  TabsItem,
  Textarea,
  Toast,
} from '@/components/ui';
import { DirectoryIcon, HomeIcon, UserCircleIcon } from '@/icons';

export default function HomePlaceholder() {
  const [showToast, setShowToast] = useState(true);
  const [note, setNote] = useState('');
  const [consultReason, setConsultReason] = useState('symptomes');
  const [activeMenuItem, setActiveMenuItem] = useState('accueil');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('apercu');
  const [consultMode, setConsultMode] = useState('presentiel');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [dangerDialogOpen, setDangerDialogOpen] = useState(false);

  return (
    <div className="bg-neutral-05 flex w-full justify-center px-8 py-12">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <p className="text-heading-primary text-lg font-medium">Connexion réussie.</p>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Avatar</h2>
          <div className="flex items-center gap-4">
            <Avatar name="Rihab" />
            <Avatar name="Karim" />
            <Avatar src="https://i.pravatar.cc/64?img=5" alt="Photo de profil" />
            <Avatar
              src="https://i.pravatar.cc/64?img=8"
              alt="Photo de profil"
              className="size-12"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Card</h2>
          <Card title="Informations">
            <p className="text-body-secondary text-sm">
              Contenu libre passé en enfant — texte, liste, autre composant, etc.
            </p>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Chip</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Chip label="Migraine" onRemove={() => alert('remove Migraine')} />
            <Chip
              label="Antécédent familial"
              onRemove={() => alert('remove Antécédent familial')}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">FilterChip</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterChip label="Filtre" />
            <FilterChip label="Filtre" state="activated" count={3} />
            <FilterChip state="activated" count={1} />
            <FilterChip />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Alert</h2>
          <div className="flex flex-col gap-3">
            <Alert type="success" title="Titre de l'alerte" description="Message de l'alerte" />
            <Alert type="info" title="Titre de l'alerte" description="Message de l'alerte" />
            <Alert type="warning" title="Titre de l'alerte" description="Message de l'alerte" />
            <Alert type="danger" title="Titre de l'alerte" description="Message de l'alerte" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Badge</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge label="Label" color="success" />
            <Badge label="Label" color="info" />
            <Badge label="Label" color="warning" />
            <Badge label="Label" color="danger" />
            <Badge label="Label" color="primary" />
            <Badge label="Label" color="secondary" />
            <Badge label="Label" color="neutral" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge label="Label" color="success" size="md" hasDot />
            <Badge label="Label" color="danger" size="md" />
            <BadgeNotification count={9} />
            <BadgeNotification color="wireframe" count={3} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Toast</h2>
          {showToast && (
            <Toast
              label="Vos informations ont été enregistrées."
              onClose={() => setShowToast(false)}
            />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Textarea</h2>
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Je..."
              value={note}
              onChange={event => setNote(event.target.value)}
            />
            <Textarea placeholder="Je..." error />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Field</h2>
          <div className="flex flex-col gap-3">
            <Field
              label="Décrivez vos symptômes"
              required
              htmlFor="home-field-textarea"
              helperText="Depuis quand, ce que vous ressentez, ce que ça change au quotidien."
            >
              <Textarea id="home-field-textarea" placeholder="Je..." />
            </Field>
            <Field
              label="Décrivez vos symptômes"
              required
              htmlFor="home-field-textarea-error"
              error="Ce champ est obligatoire."
            >
              <Textarea id="home-field-textarea-error" placeholder="Je..." error />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">OptionList</h2>
          <OptionList aria-label="Motif de consultation">
            <Option
              label="Symptômes physiques"
              selected={consultReason === 'symptomes'}
              onClick={() => setConsultReason('symptomes')}
            />
            <Option
              label="Suivi de traitement"
              selected={consultReason === 'suivi'}
              onClick={() => setConsultReason('suivi')}
            />
            <Option
              label="Question générale"
              selected={consultReason === 'question'}
              onClick={() => setConsultReason('question')}
            />
          </OptionList>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Menu</h2>
          <Menu aria-label="Navigation" className="max-w-75">
            <MenuItem
              label="Accueil"
              icon={<HomeIcon size={24} />}
              selected={activeMenuItem === 'accueil'}
              onClick={() => setActiveMenuItem('accueil')}
            />
            <MenuItem
              label="Annuaire"
              icon={<DirectoryIcon size={24} />}
              number="3"
              selected={activeMenuItem === 'annuaire'}
              onClick={() => setActiveMenuItem('annuaire')}
            />
            <MenuItem
              label="Mon compte"
              icon={<UserCircleIcon size={24} />}
              selected={activeMenuItem === 'compte'}
              onClick={() => setActiveMenuItem('compte')}
            />
            <MenuItem label="Se déconnecter" color="danger" onClick={() => alert('Déconnexion')} />
          </Menu>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">SearchBar</h2>
          <div className="flex flex-col gap-3">
            <SearchBar
              placeholder="Rechercher un médecin, une spécialité..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <SearchBar placeholder="Rechercher..." disabled />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Tabs</h2>
          <Tabs aria-label="Sections du dossier">
            <TabsItem
              label="Aperçu"
              active={activeTab === 'apercu'}
              onClick={() => setActiveTab('apercu')}
            />
            <TabsItem
              label="Consultations"
              active={activeTab === 'consultations'}
              onClick={() => setActiveTab('consultations')}
            />
            <TabsItem
              label="Documents"
              active={activeTab === 'documents'}
              onClick={() => setActiveTab('documents')}
            />
          </Tabs>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Link</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link label="En savoir plus" href="#" />
            <Link label="Voir tout" href="#" size="sm" iconPosition="none" />
            <Link label="Retour" href="#" iconPosition="left" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">List</h2>
          <List aria-label="Paramètres du compte" className="max-w-75">
            <ListItem label="Informations personnelles" icon={<UserCircleIcon size={24} />} />
            <ListItem label="Annuaire des praticiens" icon={<DirectoryIcon size={24} />} />
            <ListItem label="Supprimer mon compte" danger />
          </List>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Select</h2>
          <div className="flex flex-col gap-3">
            <Select placeholder="Choisissez une spécialité" defaultValue="">
              <option value="generaliste">Médecin généraliste</option>
              <option value="dermato">Dermatologue</option>
              <option value="cardio">Cardiologue</option>
            </Select>
            <Select placeholder="Choisissez une spécialité" error="Ce champ est obligatoire." />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Radio</h2>
          <RadioGroup aria-label="Mode de consultation">
            <Radio
              name="consult-mode"
              label="En présentiel"
              checked={consultMode === 'presentiel'}
              onChange={() => setConsultMode('presentiel')}
            />
            <Radio
              name="consult-mode"
              label="En téléconsultation"
              checked={consultMode === 'teleconsultation'}
              onChange={() => setConsultMode('teleconsultation')}
            />
            <Radio name="consult-mode" label="Option désactivée" disabled />
          </RadioGroup>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Switch</h2>
          <div className="flex flex-col gap-3">
            <Switch
              label="Notifications de rappel"
              checked={notifEnabled}
              onCheckedChange={setNotifEnabled}
            />
            <Switch label="Option désactivée" disabled />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Dialog</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Dialog
              open={validationDialogOpen}
              onOpenChange={setValidationDialogOpen}
              trigger={<Button variant="outline">Ouvrir le dialogue</Button>}
              title="Title"
              description="Question"
              onConfirm={() => alert('Validé')}
            />
            <Dialog
              open={dangerDialogOpen}
              onOpenChange={setDangerDialogOpen}
              trigger={<Button variant="destructive">Supprimer le compte</Button>}
              title="Title"
              description="Question"
              type="danger"
              onConfirm={() => alert('Supprimé')}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Sheet</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Sheet
              trigger={<Button variant="outline">Sheet (bar)</Button>}
              title="Filtrer"
              variant="bar"
            >
              <p className="text-body-secondary text-sm">Contenu du sheet.</p>
            </Sheet>
            <Sheet
              trigger={<Button variant="outline">Sheet (titre)</Button>}
              title="Filtrer les résultats"
              variant="close-button"
            >
              <p className="text-body-secondary text-sm">Contenu du sheet.</p>
            </Sheet>
            <Sheet
              trigger={<Button variant="outline">Sheet (fermer seul)</Button>}
              title="Filtrer"
              variant="sm-close-button"
            >
              <p className="text-body-secondary text-sm">Contenu du sheet.</p>
            </Sheet>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-body-primary text-sm font-medium">Dropdown</h2>
          <Dropdown trigger={<Button variant="outline">Actions</Button>}>
            <Menu>
              <MenuItem label="Modifier" icon={<UserCircleIcon size={24} />} />
              <MenuItem label="Archiver" icon={<DirectoryIcon size={24} />} />
              <MenuItem label="Supprimer" color="danger" />
            </Menu>
          </Dropdown>
        </section>
      </div>
    </div>
  );
}
