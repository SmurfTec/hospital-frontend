import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ConfirmDialog from 'dialogs/ConfirmDialogBox';
import Label from 'components/Label';
import { Button } from '@material-ui/core';
import { DataContext } from 'contexts/DataContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    marginLeft: 'auto',
    marginRight: 10
  },
  completeBtn: {
    fontSize: '0.em',
    color: theme.palette.primary,
    marginLeft: 'auto',
    marginRight: 10
  },
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    marginRight: 10
  }
}));

const TaskStages = ({ stages, taskId }) => {
  const { completeTaskStage } = useContext(DataContext);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [currentStageId, setCurrentStageId] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const stagesIds = stages.map((el) => el._id);
    setExpanded(stagesIds);
  }, [stages]);

  const handleChange = (id) => {
    const include = expanded.includes(id);

    if (include) {
      const newExpanded = expanded.filter((el) => el !== id);
      setExpanded(newExpanded);
    } else {
      const newExpanded = [...expanded, id];
      setExpanded(Array.from(new Set(newExpanded)));
    }
  };

  const handleComplete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentStageId(id);
    setIsOpen(true);
  };

  const handleCompleteSuccess = () => {
    toggleIsOpen();
    completeTaskStage(taskId, currentStageId);
    setCurrentStageId(undefined);
  };

  return (
    <div className={classes.root}>
      {stages.map((stage) => (
        <Accordion
          expanded={expanded.includes(stage._id) !== false}
          onChange={() => handleChange(stage._id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id={`${stage._id}header`}
          >
            <Typography className={classes.heading}>
              <b> Name </b> : {stage.name}
            </Typography>
            {stage.status === 'complete' && (
              <Typography className={classes.secondaryHeading}>
                <Label
                  variant="ghost"
                  color="info"
                  style={{
                    alignSelf: 'end'
                  }}
                >
                  {new Date(stage.completionDate).toDateString()}
                </Label>
              </Typography>
            )}
            {stage.status !== 'complete' && (
              <Button
                startIcon={<CheckCircleIcon />}
                color="primary"
                variant="outlined"
                className={classes.completeBtn}
                size="small"
                onClick={(e) => handleComplete(e, stage._id)}
              >
                Mark as Complete
              </Button>
            )}
            <Typography className={classes.thirdHeading}>
              <Label
                variant="ghost"
                color={`${stage.status === 'complete' ? 'success' : 'warning'}`}
                style={{
                  alignSelf: 'end'
                }}
              >
                {stage.status}
              </Label>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b> description </b> : {stage.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      <ConfirmDialog
        open={isOpen}
        success={handleCompleteSuccess}
        toggleDialog={toggleIsOpen}
        dialogTitle="Complete this Stage"
      />
    </div>
  );
};
export default TaskStages;
