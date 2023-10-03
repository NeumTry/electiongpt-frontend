'use client';
import '../css/class-styles.css';

import { useChat } from 'ai/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRef, useEffect } from 'react';

// //  NOTEs: 
// add picture of the candidate instead of the AI - can we?
// memory for bot
// deploy
// analytics
// Scrolling of the Chat, need to create a component and make it scrollable so that it doens't go to the bottom of the page

// sign in usage? supa?


export default function Chat() {
  const republicanCandidates = [
    {'name': 'Donald Trump', 'pipeline_id': 'a6da436b-b1ca-455f-8585-9284272c5ea2','party':'republican'},
    {'name': 'Ron DeSantis', 'pipeline_id': 'e6f463bb-f740-4bc6-89c3-51c0c7547b77','party':'republican'},
    {'name': 'Chris Christie', 'pipeline_id': 'a9a90214-429b-4feb-a1f1-2f02f26c5946','party':'republican'},
    {'name': 'Doug Burgum', 'pipeline_id': '70a8576a-9e15-4564-a04a-3e5ddb69ff6f','party':'republican'},
    {'name': 'Vivek Ramaswamy', 'pipeline_id': 'bf77b928-6abb-468b-83a0-a1b33a9e816e','party':'republican'},
    {'name': 'Asa Hutchinson', 'pipeline_id': '85e752c1-be10-4eb3-a704-0f6d9539fca9','party':'republican'},
    {'name': 'Tim Scott', 'pipeline_id': '7f904d33-a020-4428-a7da-ab73258be90c','party':'republican'},
    {'name': 'Corey Stapleton', 'pipeline_id': '486c96e1-9cd5-44da-babb-3d78900c505d','party':'republican'},
    {'name': 'Mike Pence', 'pipeline_id': '2db577a6-4e54-470c-878c-018fc5969559','party':'republican'},
    {'name': 'Perry Johnson', 'pipeline_id': '310c10c9-095a-4fe4-8619-3ac851504eb4','party':'republican'},
    {'name': 'Ryan Binkley', 'pipeline_id': '5402bcd4-2192-452b-8850-d348f7086ee0','party':'republican'},
    {'name': 'Will Hurd', 'pipeline_id': '05a41ac2-892d-4325-b5d6-26e966a7fcb3','party':'republican'},
    {'name': 'Nikki Haley', 'pipeline_id': '2296e6c0-e997-484e-9d90-d82da1e23d4a','party':'republican'},
    {'name': 'Larry Elder', 'pipeline_id': '03a89b42-2577-4a77-bd07-2722cb065b3b', 'party':'republican'},
]
  const democraticCandidates = [
    {'name': 'Joe Biden', 'pipeline_id': '5eb223c6-f653-46f0-aa4b-149601078492', 'party':'democratic'},
    {'name': 'Marianne Williamson', 'pipeline_id': '8b5a70b4-5d32-4aec-9865-90f047e1d762', 'party':'democratic'},
    {'name': 'Robert F Kennedy', 'pipeline_id': 'e65f7d7f-d679-4dd5-8a7c-97be110e54b4', 'party':'democratic'},
  ]

  const matches = useMediaQuery('(min-width:960px)');
  const [sidebarOpen, setSidebarOpen] = useState(matches);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [candidateChosen, setCandidateChosen] = useState({'name':'','pipeline_id':'', 'party':''})
  const { messages, input, handleInputChange, handleSubmit, data } = useChat({headers:{'candidateName':candidateChosen.name, 'candidatePipeline':candidateChosen.pipeline_id}});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const chatContainerRef = useRef<any>({});

  const DrawerHeader = styled('div')(({ theme }:any) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const theme = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(true);
  };

  const toggleAbout = () => {
    setAboutOpen(true);
  };

  const handleCandidateChosenClick = (candidate:any) => () => {
    setCandidateChosen(candidate)
  };

  const handleSubmitForm = (e:any) => {
    if(candidateChosen.name === ""){
      console.log("please choose a candidate!")
      setSnackbarOpen(true);

      e.preventDefault()
    }
    else{
      handleSubmit(e)
    }
  }

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setSidebarOpen(matches);
  }, [matches]);

  return (  
    <div>
      <header className={`header-background sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl ${matches ? 'ml-[400px]' : ''}`}>
      <div className="flex items-center">
        {!matches && <IconButton onClick={toggleSidebar}>
          <MenuIcon className='white-icon'/>
        </IconButton>}
      </div>
      <div className="flex items-center text-[#e0e0e0]">
        🗳️ ElectionGPT
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button className="header-button" onClick={toggleAbout}>About</Button>
      </div>
    </header>      
    <Drawer anchor="left" open={sidebarOpen} variant={matches ? 'permanent' : 'temporary'}>
      <div style={{width:400, paddingLeft:20, paddingRight:20}}>
        <DrawerHeader>
          {!matches && <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>}
        </DrawerHeader>
        <Typography variant="h4" gutterBottom>
        🗳️ ElectionGPT
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Built using <a style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Neum AI</a>
          </Typography>
          <Typography paragraph>
          ElectionGPT helps you learn about the proposals of the different presidential candidates. It is a chat interface that leverages AI contextualized by the candiddates proposals.
          <br></br>
          <br></br>
          Pick a candidate below. List updated as of 10/2/2023.
          <br></br>
          <br></br>
          </Typography>
          <Typography variant="h6" gutterBottom>
            List of candidates
        </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Republican Candidates</Typography>
            </AccordionSummary>
          <AccordionDetails > 
            {republicanCandidates.map( candidate =>
            <div key={candidate.name}>
              <Button variant="outlined" color="error" onClick={handleCandidateChosenClick(candidate)}>
              {candidate.name}
            </Button>
            <br></br>
            <br></br>
            </div>
            )}
            {/* We can probably make this fancier with a box or something so that they are not each in one line - Can we use their pictures?*/}
          </AccordionDetails>
        </Accordion>
        <br></br>
        <br></br>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Democrat Candidates</Typography>
            </AccordionSummary>
            <AccordionDetails>
            {democraticCandidates.map( candidate =>
              <div key={candidate.name}>
                <Button variant="outlined" onClick={handleCandidateChosenClick(candidate)}>
                {candidate.name}
              </Button>
              <br></br>
              <br></br>
              </div>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </Drawer>
    <Drawer anchor='right' open={aboutOpen} variant='temporary'>
      <div style={{width:400, paddingLeft:20, paddingRight:20}}>
        <DrawerHeader>
          <IconButton onClick={handleAboutClose}>
            <CloseIcon/>
          </IconButton>
        </DrawerHeader>
          <Typography variant="h4" gutterBottom>
            About
          </Typography>
          <Typography paragraph>
            ElectionGPT is continously updated with data for the candidates from a variety of sources. The goal is to present an unbiased, up to date interface into each candidates government plan. We built ElectionGPT to help us understand the candidates and their perspectives outside of the noisiness of media and news; grounded on their core proposals and beliefs. 
            <br></br>
            <br></br>
            ElectionGPT pulls from data sources such as:
            <li>Wikipedia</li>
            <li>Ballotpedia</li>
            <li>Candidate Websites</li>
            <li>Published government plans</li>
            <br></br>
            <br></br>
            Behind the scenes, ElectionGPT is built on top of <a style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Neum AI</a> which continously connects data sources into a vector database (<a style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Weaviate ❤️</a>) where it is accessed at runtime to compose responses. 
          </Typography>
        </div>
    </Drawer>
    <div className={`main-content ${matches ? 'ml-[400px]' : ''}`}>
      <div className="flex flex-col w-full max-w-md pt-10 mx-auto stretch">
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          {candidateChosen.name == "" ? "Choose a candidate" : "Chat about " + candidateChosen.name } 
        </Typography>
        <div className="message-container" style={{ maxHeight: '85vh', overflowY: 'auto' }} ref={chatContainerRef}>
          {messages.length > 0
          ? messages.map((m:any, index:any) => (
              <div key={m.id} className={`message-container ${m.role}`}>
                <div className="message-content">
                  <div className="icon-container">
                    {m.role === 'user' 
                      ? <FontAwesomeIcon icon={faUser} className="icon user" />
                      : <FontAwesomeIcon icon={faRobot} className="icon ai" />}
                  </div>
                  {m.content}
                </div>
                <br></br>
                {index !== messages.length - 1 && <div className="divider" />}

              </div>
            ))
          : null}
        </div>
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          Please choose a candidate before sending a message!
        </Alert>
      </Snackbar>
        <div className='flex justify-center items-center'>
          <form className="submission-form mx-auto" onSubmit={handleSubmitForm}>
            <input
              className="submission-input"
              value={input}
              placeholder="Type here to chat!"
              onChange={handleInputChange}
            />
            <button type="submit" className={`${candidateChosen.party == "" ? "submission-button-color-standard" : `submission-button-color-${candidateChosen.party}`} submission-button`}>Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}