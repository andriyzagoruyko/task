import { LinearProgress } from "@material-ui/core";
import { createUseStyles } from "react-jss";

export function ProgressBar({ progress }: { progress: number }) {
  const styles = useStyles();
  if (!progress) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <LinearProgress
        variant="determinate"
        value={progress}
        color="secondary"
      />
    </div>
  );
}

const useStyles = createUseStyles({
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  },
});
