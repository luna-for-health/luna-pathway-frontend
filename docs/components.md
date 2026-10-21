# Components

Shared UI lives in `src/components/`: design-system components in `ui/` and app chrome in `layout/`.
Their props types are in `src/types/ui.ts` and `src/types/layout.ts`. For the overall architecture,
see [`architecture.md`](./architecture.md).

## Conventions

- **Import from the barrels:** `import { Button, Field, Input } from '@/components/ui';`. Every
  component folder has an `index.ts` that exports the components and their props types.
- **Design tokens:** colors, fonts and radii come from Luna's Figma design system and are defined in
  `src/index.css` (`@theme`). Use the token classes (`text-heading-primary`, `bg-neutral-05`, …)
  instead of raw colors.
- **shadcn/ui:** components added with `npx shadcn add` must be restyled to the Luna design system
  (variants, sizes, colors) before they are used. Never ship shadcn's defaults.
- **Class names:** merge classes with `cn()` from `@/lib/utils`. Every component accepts a
  `className` to extend its styles.
- **Icons:** one component per file in `src/icons/`, named `PascalCase` + `Icon` (`SearchIcon`),
  exported from `@/icons`. Two color patterns exist:
  - **`useIcon` + `IconProps`** for icons that always use one fixed color:
    `<MailIcon color="formFieldIcon" size="medium" />` (stroke icons use `color`, fill icons use
    `fillColor`, both take a token name).
  - **`currentColor`** for icons whose color changes with state (button variants, active nav item,
    alerts): they inherit the surrounding `text-*` class.

## UI components (`src/components/ui`)

**Actions**

| Component   | File             | Use it for                       | Main props                              |
| ----------- | ---------------- | -------------------------------- | --------------------------------------- |
| `Button`    | `button.tsx`     | Every button                     | `variant`, `size`, `loading`, `asChild` |
| `SSOButton` | `sso-button.tsx` | "Continuer avec Google / Apple"  | `provider` (`google` \| `apple`)        |
| `Link`      | `link.tsx`       | Text links with an optional icon | `label`, `size`, `icon`, `iconPosition` |

**Form**

| Component                           | File                           | Use it for                                   | Main props                                       |
| ----------------------------------- | ------------------------------ | -------------------------------------------- | ------------------------------------------------ |
| `Field`                             | `field.tsx`                    | Label + helper text + error around a control | `label`, `required`, `helperText`, `error`       |
| `Input`                             | `input.tsx`                    | Text inputs                                  | `label`, `icon`, `error`                         |
| `Textarea`                          | `textarea.tsx`                 | Multiline text, with an optional action slot | `error`, `children`                              |
| `Select`                            | `select.tsx`                   | Native select                                | `placeholder`, `error`                           |
| `SearchBar`                         | `search-bar.tsx`               | Search input with icon                       | input props                                      |
| `Checkbox`                          | `checkbox.tsx`                 | Checkbox                                     | `label`, `indeterminate`                         |
| `Radio` / `RadioGroup`              | `radio.tsx`, `radio-group.tsx` | Single choice                                | `label`                                          |
| `Switch`                            | `switch.tsx`                   | On/off toggle                                | `checked`, `onCheckedChange`, `label`            |
| `OptionList` / `Option`             | `option-list.tsx`              | Pill-style single choice                     | `label`, `selected`                              |
| `SegmentedButton` / `SegmentedItem` | `segmented-button.tsx`         | Segmented control                            | `label`, `count`, `active`                       |
| `EvaSlider` / `EvaScoreBar`         | `eva-slider.tsx`               | 0–10 pain scale (input / read-only)          | `value`, `onValueChange`, `title`, `description` |

**Feedback**

| Component        | File                  | Use it for              | Main props                                                                    |
| ---------------- | --------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `Alert`          | `alert.tsx`           | Inline message          | `type` (`success` \| `info` \| `warning` \| `danger`), `title`, `description` |
| `Toast`          | `toast.tsx`           | Short notification      | `label`, `icon`, `onClose`                                                    |
| `Loader`         | `loader.tsx`          | Spinner                 | `variant` (`arc` \| `spokes`), `color`                                        |
| `LoadingOverlay` | `loading-overlay.tsx` | Full-area loading state | `visible`                                                                     |

**Overlays**

| Component  | File           | Use it for                          | Main props                                                   |
| ---------- | -------------- | ----------------------------------- | ------------------------------------------------------------ |
| `Dialog`   | `dialog.tsx`   | Confirmation / modal dialogs        | `open`, `onOpenChange`, `title`, `confirmLabel`, `onConfirm` |
| `Sheet`    | `sheet.tsx`    | Bottom sheet / side panel           | `open`, `onOpenChange`, `title`, `variant`                   |
| `Dropdown` | `dropdown.tsx` | Floating menu anchored to a trigger | `trigger`, `align`, `side`                                   |

**Display**

| Component                                                                                            | File            | Use it for                 | Main props                            |
| ---------------------------------------------------------------------------------------------------- | --------------- | -------------------------- | ------------------------------------- |
| `Card`                                                                                               | `card.tsx`      | Content container          | `title`                               |
| `Avatar`                                                                                             | `avatar.tsx`    | User picture or initials   | `src`, `alt`, `name`                  |
| `Badge` / `BadgeNotification`                                                                        | `badge.tsx`     | Status label / counter dot | `label`, `color`, `size`, `count`     |
| `Chip` / `FilterChip`                                                                                | `chip.tsx`      | Removable tag / filter     | `label`, `onRemove`, `state`, `count` |
| `List` / `ListItem`                                                                                  | `list-item.tsx` | Clickable rows             | `label`, `icon`, `hasArrow`, `danger` |
| `Menu` / `MenuItem`                                                                                  | `menu-item.tsx` | Menu entries               | `label`, `icon`, `selected`, `color`  |
| `Tabs` / `TabsItem`                                                                                  | `tabs.tsx`      | Tabs                       | `label`, `active`                     |
| `Carousel` (+ `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselDots`) | `carousel.tsx`  | Slides (Embla)             | Embla options                         |

`slider.tsx` is a Radix slider wrapper that is not exported or used yet.

## Layout components (`src/components/layout`)

| Component           | Use it for                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `WebHeader`         | Page header with the logo; `onBack` / `onMenuToggle` on mobile, `centerContent` on desktop |
| `MainNav`           | Patient navigation (Accueil, Annuaire, Dossier, Compte)                                    |
| `SecretarySidebar`  | Secretary navigation and account menu (logout)                                             |
| `Logo` / `LogoMark` | Full Luna logo / moon only                                                                 |

## Examples

```tsx
import { Button, Field, Input } from '@/components/ui';
import { MailIcon } from '@/icons';

<Field label="Votre e-mail" required error={errors.email?.message}>
  <Input
    type="email"
    placeholder="luna@gmail.com"
    icon={<MailIcon color="formFieldIcon" size="small" />}
    {...register('email')}
  />
</Field>

<Button type="submit" loading={isPending}>
  Continuer
</Button>
```

```tsx
import { Alert, Badge } from '@/components/ui';

<Alert type="warning" title="Document trop volumineux" description="10 Mo maximum." />
<Badge label="Traitée" color="success" />
```
