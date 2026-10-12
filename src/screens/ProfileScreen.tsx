import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FormField } from '../components/FormField';
import { ImageSlot } from '../components/ImageSlot';
import { Screen } from '../components/Screen';
import { SectionHeading } from '../components/SectionHeading';
import { useProfile } from '../context/ProfileContext';
import { defaultPortrait } from '../data/artwork';
import { pickProfileImage } from '../media/pickImage';
import { copyIntoAppStorage } from '../storage/profileStorage';
import { colors, spacing } from '../theme/colors';
import {
  AVAILABILITY_OPTIONS,
  Profile,
  ProfileFieldErrors,
  profileHasErrors,
  sanitizeProfile,
  validateProfile,
} from '../validation/profileRules';

export function ProfileScreen() {
  const { profile, ready, revision, saveProfile, resetProfile } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [notice, setNotice] = useState<{ text: string; tone: 'ok' | 'error' } | null>(null);
  const [portraitMessage, setPortraitMessage] = useState<string | null>(null);
  const [cardMessage, setCardMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(profile);
    setErrors({});
    setConfirmReset(false);
  }, [profile, revision]);

  async function updateImage(slot: 'portrait' | 'card', source: 'camera' | 'library') {
    const setMessage = slot === 'portrait' ? setPortraitMessage : setCardMessage;
    const outcome = await pickProfileImage(source, slot === 'portrait' ? [1, 1] : [4, 3]);

    if (outcome.status === 'denied') {
      setMessage('Permission was denied. The current image was kept.');
      return;
    }
    if (outcome.status === 'cancelled') {
      setMessage('Selection was cancelled. The current image was kept.');
      return;
    }
    if (outcome.status === 'failed') {
      setMessage(outcome.message);
      return;
    }

    try {
      const fileName = slot === 'portrait' ? 'portrait.jpg' : 'verification-card.jpg';
      const storedUri = await copyIntoAppStorage(outcome.uri, fileName);
      setDraft((current) => ({
        ...current,
        portraitUri: slot === 'portrait' ? storedUri : current.portraitUri,
        verificationCardUri: slot === 'card' ? storedUri : current.verificationCardUri,
      }));
      setMessage('Preview updated. Save the profile to keep it after you close the app.');
    } catch {
      setMessage('The image could not be stored on this phone. The current image was kept.');
    }
  }

  function removeImage(slot: 'portrait' | 'card') {
    setDraft((current) => ({
      ...current,
      portraitUri: slot === 'portrait' ? null : current.portraitUri,
      verificationCardUri: slot === 'card' ? null : current.verificationCardUri,
    }));
    const setMessage = slot === 'portrait' ? setPortraitMessage : setCardMessage;
    setMessage('Image removed from this draft. Save the profile to apply it after a restart.');
  }

  async function handleSave() {
    const next = sanitizeProfile(draft);
    const nextErrors = validateProfile(next);
    setDraft(next);
    setErrors(nextErrors);
    if (profileHasErrors(nextErrors)) {
      setNotice({ text: 'Save was blocked. Fix the highlighted fields.', tone: 'error' });
      return;
    }
    setSaving(true);
    try {
      await saveProfile(next);
      setNotice({
        text: 'Profile saved on this phone. Close and reopen the app to confirm it returns.',
        tone: 'ok',
      });
    } catch {
      setNotice({ text: 'The profile could not be saved on this phone. Try again.', tone: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      await resetProfile();
      setNotice({ text: 'Saved profile removed. The original text is restored.', tone: 'ok' });
      setPortraitMessage(null);
      setCardMessage(null);
    } catch {
      setNotice({ text: 'The saved profile could not be removed. Try again.', tone: 'error' });
    } finally {
      setSaving(false);
      setConfirmReset(false);
    }
  }

  if (!ready) {
    return (
      <Screen>
        <SectionHeading eyebrow="Editable" title="Profile" />
        <Text style={styles.lead}>Loading the saved profile…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeading eyebrow="Editable" title="Profile" />
      <Text style={styles.lead}>
        Update the headline, biography, primary skill, and availability. Invalid fields block the save.
      </Text>
      <ImageSlot
        title="Profile image"
        uri={draft.portraitUri}
        fallback={defaultPortrait}
        emptyText="No profile image yet."
        aspectRatio={1}
        message={portraitMessage}
        onCamera={() => updateImage('portrait', 'camera')}
        onLibrary={() => updateImage('portrait', 'library')}
        onRemove={() => removeImage('portrait')}
      />
      <ImageSlot
        title="Verification card"
        uri={draft.verificationCardUri}
        emptyText="No verification card photo yet. Photograph the handwritten card, then preview it here."
        aspectRatio={4 / 3}
        message={cardMessage}
        onCamera={() => updateImage('card', 'camera')}
        onLibrary={() => updateImage('card', 'library')}
        onRemove={() => removeImage('card')}
      />
      <FormField
        label="Headline"
        value={draft.headline}
        onChangeText={(headline) => setDraft((current) => ({ ...current, headline }))}
        error={errors.headline}
        hint="8 to 80 characters."
      />
      <FormField
        label="Short biography"
        value={draft.biography}
        onChangeText={(biography) => setDraft((current) => ({ ...current, biography }))}
        error={errors.biography}
        hint="40 to 400 characters, and at least six words."
        multiline
      />
      <FormField
        label="Primary skill"
        value={draft.primarySkill}
        onChangeText={(primarySkill) => setDraft((current) => ({ ...current, primarySkill }))}
        error={errors.primarySkill}
        hint="Letters, spaces, and hyphens only. 2 to 40 characters."
      />
      <View style={styles.field}>
        <Text style={styles.label}>Availability status</Text>
        <View style={styles.choices}>
          {AVAILABILITY_OPTIONS.map((option) => {
            const selected = draft.availability === option;
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    availability: option,
                  }))
                }
                style={[styles.choice, selected && styles.choiceSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option}
              >
                <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.availability ? <Text style={styles.error}>{errors.availability}</Text> : null}
      </View>
      {notice ? (
        <Text style={[styles.notice, notice.tone === 'error' ? styles.noticeError : null]}>{notice.text}</Text>
      ) : null}
      <Pressable
        style={[styles.save, saving && styles.disabled]}
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel="Save profile"
      >
        <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save profile'}</Text>
      </Pressable>
      {confirmReset ? (
        <View style={styles.resetBox}>
          <Text style={styles.resetCopy}>Remove the saved profile and restore the original text and images?</Text>
          <Pressable style={styles.resetConfirm} onPress={handleReset} accessibilityRole="button">
            <Text style={styles.resetConfirmText}>Confirm reset</Text>
          </Pressable>
          <Pressable style={styles.resetCancel} onPress={() => setConfirmReset(false)} accessibilityRole="button">
            <Text style={styles.resetCancelText}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.reset} onPress={() => setConfirmReset(true)} accessibilityRole="button">
          <Text style={styles.resetText}>Reset saved profile</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  choices: {
    gap: spacing.sm,
  },
  choice: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.input,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  choiceSelected: {
    borderColor: colors.olive,
    backgroundColor: colors.olive,
  },
  choiceText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  choiceTextSelected: {
    color: colors.white,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  notice: {
    backgroundColor: colors.successSoft,
    color: colors.success,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  noticeError: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
  },
  save: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: colors.void,
    fontSize: 17,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
  reset: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  resetBox: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.dangerSoft,
  },
  resetCopy: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  resetConfirm: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.dangerStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetConfirmText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  resetCancel: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetCancelText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 16,
  },
});
