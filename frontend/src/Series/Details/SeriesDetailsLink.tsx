import React from 'react';
import Link from 'Components/Link/Link';
import Label from 'Components/Label';
import ClipboardButton from 'Components/Link/ClipboardButton';
import { kinds, sizes } from 'Helpers/Props';
import styles from './SeriesDetailsLinks.css';

interface SeriesDetailsLinkProps {
  url: string;
  label: string;
  idValue: string | number;
  copyTitle?: string;
}

const SeriesDetailsLink: React.FC<SeriesDetailsLinkProps> = ({
  url,
  label,
  idValue,
  copyTitle = 'Copy ID'
}) => (
  <div className={styles.linkGroup}>
    <Link className={styles.link} to={url}>
      <Label className={styles.linkLabel} kind={kinds.INFO} size={sizes.LARGE}>
        {label}
      </Label>
    </Link>
    <div className={styles.idCopyButtonRow}>
      <span className={styles.idLabel}>{idValue}</span>
      <ClipboardButton
        value={idValue.toString()}
        kind={kinds.DEFAULT}
        className={styles.idCopyButton}
        title={copyTitle}
      />
    </div>
  </div>
);

export default SeriesDetailsLink;