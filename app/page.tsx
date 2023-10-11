'use client';
import '../css/class-styles.css';
import Link from 'next/link'
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
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/chat-message';
import va from '@vercel/analytics';
import { clarity } from 'react-microsoft-clarity';
import { useClerk } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Textarea from '@mui/joy/Textarea';
import { SocialIcon } from 'react-social-icons'

// New pipelines as of 10/6
export default function Chat() {
  const router = useRouter()
  const republicanCandidates = [
    {'name': 'Ryan Binkley', 'pipeline_id': '1a2b7503-08b2-4a32-90e0-ba4cc3a33499','party':'republican'},
    {'name': 'Doug Burgum', 'pipeline_id': 'e3d53062-41b7-4f0b-8966-be5cfe1c90ed','party':'republican'},
    {'name': 'Chris Christie', 'pipeline_id': '43b23881-ebc7-4faa-9671-25c3be1b4522','party':'republican'},
    {'name': 'Ron DeSantis', 'pipeline_id': 'ba9ffc9c-47c0-4e40-ba9f-cafee3f3afbb','party':'republican'},
    {'name': 'Larry Elder', 'pipeline_id': '9bdc83ad-7b99-404c-886d-bd0f0ffab973', 'party':'republican'},
    {'name': 'Nikki Haley', 'pipeline_id': '76c70a2d-4237-4271-9f46-7ff572fcc28b','party':'republican'},
    {'name': 'Will Hurd', 'pipeline_id': '4fec3803-b539-44bb-ae62-715f0aa59957','party':'republican'},
    {'name': 'Asa Hutchinson', 'pipeline_id': '9e6fbe35-b650-4aaf-bb39-ed34aa5b1a4e','party':'republican'},
    {'name': 'Perry Johnson', 'pipeline_id': 'fd827a7f-640c-4641-b402-3b9e92d87ace','party':'republican'},
    {'name': 'Mike Pence', 'pipeline_id': '3219ff3d-48d5-4265-81b9-775de156f273','party':'republican'},
    {'name': 'Vivek Ramaswamy', 'pipeline_id': 'd3ab4948-0481-45f0-9f52-534e1809515e','party':'republican'}, // try this new one: fue shabat no logre test - d3ab4948-0481-45f0-9f52-534e1809515e
    {'name': 'Tim Scott', 'pipeline_id': '1b25d129-402f-488b-a894-a0ef6353e3e0','party':'republican'},
    {'name': 'Corey Stapleton', 'pipeline_id': '1416885a-6cc4-4f0b-88f7-1d14d49e717c','party':'republican'},
    {'name': 'Donald Trump', 'pipeline_id': '252aced6-ac42-41bf-b55e-42db4131404a','party':'republican'},
]

// todo
  const democraticCandidates = [
    {'name': 'Joe Biden', 'pipeline_id': 'fd4fade4-20cf-4c24-a811-2292daa6152f', 'party':'democratic'},
    {'name': 'Robert F Kennedy', 'pipeline_id': 'a86d3486-a693-4370-8eda-bbe5efc3bb7e', 'party':'democratic'},
    {'name': 'Marianne Williamson', 'pipeline_id': 'cf0127f0-40ed-4cee-8d4f-41d7ef06dc1c', 'party':'democratic'},
  ]

  const matches = useMediaQuery('(min-width:960px)');
  const [sidebarOpen, setSidebarOpen] = useState(matches);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [candidateInPreview, setCandidateInPreview] = useState({'name':'','pipeline_id':'', 'party':''})
  const [candidateChosen, setCandidateChosen] = useState({'name':'','pipeline_id':'', 'party':''})
  const { messages, input, setInput, setMessages, handleInputChange, handleSubmit, data, metadata} = useChat({headers:{'candidateName':candidateChosen.name, 'candidatePipeline':candidateChosen.pipeline_id}});
  const [snackbarOpen, setSnackbarOpen] = useState({'state':false,'message':""});
  const [successSnackbarFeedback, setSuccessSnackbarFeedback] = useState(false);
  const [debateModeClicked, setDebateModeClicked] = useState(false);
  const [signupClicked, setSignupClicked] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');

  const chatContainerRef = useRef<any>({});

  const DrawerHeader = styled('div')(({ theme }:any) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const theme = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(true);
  };

  const toggleAbout = () => {
    va.track("About button clicked")
    setAboutOpen(true);
  };

  const handleCandidateChosenClick = (candidate:any) => () => {
    va.track("Clicked Candidate button",{candidate_name:candidate.name})
    
    // Display alert saying that the conv history will get deleted if they change.. prompting to sign up.
    if(candidateChosen.name != ""){
      setOpenModal(true)
      setCandidateInPreview(candidate)
      return
    }
    setCandidateChosen(candidate)
    setSidebarOpen(false); // on mobile, set it to false if candidate is chosen so we return to the main chat panel
  };

  const handleSubmitForm = (e:any) => {
    if(candidateChosen.name === ""){
      setSnackbarOpen({'state':true,'message':"Please choose a candidate before sending a message!"});
      setInput("")
      e.preventDefault()
    }
    else{
      va.track("Sent message to chatbot", {candidate_name:candidateChosen.name})
      handleSubmit(e)
    }
  }

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  const handleFeedbackButton = () => {
    setFeedbackModal(true);
  };

  const handleFeedbackButtonClose = () => {
    setFeedbackModal(false);
  };


  const handleChangeCandidateModalClick = () => {
    setOpenModal(false);
    setCandidateChosen(candidateInPreview)
    setSidebarOpen(false)
    // Clear chat history
    setMessages([])
  };

  const handleCancelModal = () => {
    setSidebarOpen(false)
    setOpenModal(false);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };


  const handleFeedbackTextAreaChange = (event: any) => {
    setFeedbackInput(event.target.value)
  };


  const submitFeedbackForm = async () => {
    // send request to mongo, display success, clear textarea
    if(feedbackInput === ""){
      setSnackbarOpen({'state':true,'message':"Please write some feedback first!"});
    }
    else{
      try {
        const response = await fetch('/api/feedback', { 
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({ feedback: feedbackInput })
        });
        setSuccessSnackbarFeedback(true)
      } catch (error) {
        setSnackbarOpen({'state':true,'message':"There was an error submitting feedback! Sorry about this, pleas email kevin@tryneum.com if you don't mind!"});
      }
      // send to db

    }
  };

  const handleSnackbarFeedbackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessSnackbarFeedback(false);
  };


  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen({'state':false,'message':""});
  };
  
  useEffect(() =>{
    clarity.init("j527gtblbh");
  },[])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const { user } = useClerk();

  useEffect(() => {
    setSidebarOpen(matches);
  }, [matches]);

  const styleBoxModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function display_list_items(data:any, index: any){
    if(index -2 < 0)
      index = 0
    else
      index = index -2
    if(data?.length > 0 ){
      return data[index]?.sources?.map((elem:any) => (
        <ListItem key={elem} sx={{ display: 'list-item' }}>
          - <a className='sourceLinks' style={{textDecoration:"underline"}} href={elem} target ="_"> {elem}</a>
        </ListItem>
      ))
    }
  }

  const handleClose = () => {
    setUserModal(false)
}
  return (  
    <div>
      <Modal onClose={handleClose} open={userModal}>
        <Box sx={styleBoxModal}>
          <Typography variant="h4">
           Hi,{user?.fullName}!
          </Typography>
          <br></br>
          <Typography variant="subtitle1">
            You will be able to configure your profile soon!
          </Typography>
          <Typography variant="caption" color={"gray"}>
            Sign out <Link style={{textDecoration:"underline"}} href="signout">here</Link>
          </Typography>
        </Box>
      </Modal>
      <Modal onClose={handleFeedbackButtonClose} open={feedbackModal}>
        <Box sx={styleBoxModal}>
          <Typography variant="h5">
           Thanks for providing feedback!
          </Typography>
          <br></br>
          <Textarea
            color="neutral"
            disabled={false}
            minRows={2}
            placeholder="All feedback is welcomed!"
            size="lg"
            variant="outlined"
            onChange={handleFeedbackTextAreaChange}
          />
          <br></br>
          <Button onClick={submitFeedbackForm} variant="outlined">Submit</Button>
        </Box>
      </Modal>
      <Modal
        open={openModal}
        // onClose={handleModalClose}
      >
        <Box sx={styleBoxModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Choosing another candidate will clear the current conversation about {candidateChosen.name}. Do you want to continue?
          </Typography>
          <Button onClick={handleChangeCandidateModalClick} color="success">
            Yes
          </Button>
          <Button onClick={handleCancelModal} color="error">
            Cancel
          </Button>
          <br></br>
          <Typography variant="caption" color="gray">
            <i>If you wish to save the chat history upon changing candidates, sign up <Link style={{textDecoration:"underline"}} href="/signup">here</Link>, it's free and takes 5 secs!</i>
          </Typography>
        </Box>
      </Modal>

      <header className={`header-background sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl ${matches ? 'ml-[400px]' : ''}`}>
      <div className="flex items-center">
        {!matches && <IconButton onClick={toggleSidebar}>
          <MenuIcon className='white-icon'/>
        </IconButton>}
      </div>
      {matches && <Typography className="flex items-center text-[#e0e0e0]" >
        🗳️ ElectionGPT
        </Typography>}
      <div className="flex items-center justify-end space-x-2">
        <UserButton afterSignOutUrl="/"/>
        <Button className="header-button" onClick={toggleAbout}>About</Button>
        <Button onClick={handleFeedbackButton} className="header-button">Feedback</Button>
      </div>
    </header>      
    <Drawer anchor="left" open={sidebarOpen} variant={matches ? 'permanent' : 'temporary'}>
      <div style={{width:400, paddingLeft:20, paddingRight:20}}>
        <DrawerHeader className="header-flex">
        <Tabs onChange={handleTabChange} value={tabValue}>
          <Tab label="Candidates" />
          <Tab label="Saved Chats"  />
        </Tabs>
          {!matches && <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>}
        </DrawerHeader>
        {(tabValue == 0) && ( <>
        <Typography variant="h4" gutterBottom>
        🗳️ ElectionGPT
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Built using <a onClick={() => {va.track("Clicked 'on top of neum' link")}} style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Neum AI</a>
          </Typography>
          <Typography paragraph>
          ElectionGPT helps you learn about the proposals of the different presidential candidates. It is a chat interface that leverages AI contextualized by the candidates proposals and other information about them. 
          <br></br>
          <br></br>
          Pick a candidate below. List updated as of 10/2/2023. 
          <br></br>
          <br></br>
          </Typography>
          <Typography variant="h6" gutterBottom>
            Choose a candidate
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
          <Grid container spacing={2}>
            {republicanCandidates.map( candidate =>
            <div key={candidate.name} style={{paddingLeft:'5px', paddingRight:'5px'}}>
              <Button variant="outlined" color="error" onClick={handleCandidateChosenClick(candidate)}>
                {candidate.name}
              </Button>
            <br></br>
            <br></br>
            </div>
            )}
            {/* We can probably make this fancier with a box or something so that they are not each in one line - Can we use their pictures?*/}
            </Grid>
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
            <Grid container spacing={2}>
            {democraticCandidates.map( candidate =>
              <div key={candidate.name} style={{paddingLeft:'5px', paddingRight:'5px'}}>
                <Button variant="outlined" onClick={handleCandidateChosenClick(candidate)}>
                {candidate.name}
              </Button>
              <br></br>
              <br></br>
              </div>
              )}
            {/* We can probably make this fancier with a box or something so that they are not each in one line - Can we use their pictures?*/}
            </Grid>
            </AccordionDetails>
          </Accordion>
          <br></br>
          <Button onClick={() => {setDebateModeClicked(true);va.track("DebateMode clicked")}}>Debate mode</Button>
          {debateModeClicked && <Typography variant="caption">Coming soon!</Typography>}
          </>)}
          {((tabValue == 1)) && (
            <>
            {
              user == null? 
                <> 
                  <div className='centered-div'>
                    <Typography variant="h6">You need to sign up to be able to save chats!</Typography>
                    <br></br>
                    <Typography variant="caption">It's free and takes 10 seconds! Otherwise, feel free to chat without saving the history of the messages!</Typography>
                    <br></br>
                    <br></br>
                    <Button onClick={() => router.push('/signup')} variant="outlined">Sign up now</Button>
                  </div></>
              : <>
                  <div>
                    <Typography variant="h4">Saved chats</Typography>
                  </div>
                </>}
              </>
          )}
        </div>
      </Drawer>
    <Drawer anchor='right' open={aboutOpen} variant='temporary'>
      <div style={{width:400, paddingLeft:'10%', paddingRight:'10%'}}>
        <DrawerHeader>
          <IconButton onClick={handleAboutClose}>
            <CloseIcon/>
          </IconButton>
        </DrawerHeader>
          <Typography variant="h4" gutterBottom>
            About
          </Typography>
          <Typography paragraph>
            ElectionGPT is continuosly updated with data for the candidates from a variety of sources. The goal is to present an unbiased, up to date interface into each candidates government plan. We built ElectionGPT to help us understand the candidates and their perspectives outside of the noisiness of media and news; grounded on their core proposals and beliefs. 
            <br></br>
            <br></br>
            ElectionGPT pulls from data sources such as:
            <li>Wikipedia</li>
            <li>Ballotpedia</li>
            <li>Candidate Websites</li>
            <li>Published government plans</li>
            <li>Tweets</li>
            <li>Interview transcripts</li>
            <br></br>
            <br></br>
            Behind the scenes, ElectionGPT is built on top of <a onClick={() => {va.track("Clicked 'on top of neum' link in About")}} style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Neum AI</a> which continously connects data sources into a vector database (<a onClick={() => {va.track("Clicked 'Weaviate' link")}} style={{textDecoration:"underline"}} href='https://neum.ai' target='_'>Weaviate ❤️</a>) where it is accessed at runtime to compose responses. 
            <br></br>
            <br></br>
            Follow us!
            <br></br>
            <br></br>
            <SocialIcon url="https://x.com/neum_ai" target="_" bgColor="#2e2e2e" /><span style={{color:"white"}}>-</span>
            <SocialIcon url="https://www.linkedin.com/company/neumai/" bgColor="#2e2e2e" target="_"/><span style={{color:"white"}}>-</span>
            <SocialIcon url="https://discord.gg/mJeNZYRz4m" bgColor="#2e2e2e" target="_" /><span style={{color:"white"}}>-</span>
            <SocialIcon url="https://medium.com/@neum_ai/retrieval-augmented-generation-at-scale-building-a-distributed-system-for-synchronizing-and-eaa29162521" bgColor="#2e2e2e" target="_" /><span style={{color:"white"}}>-</span>
            <SocialIcon url="https://www.youtube.com/@NeumAI" bgColor="#2e2e2e" target="_" /> 
          </Typography>
        </div>
    </Drawer>
    <div className={`main-content ${matches ? 'ml-[400px]' : ''}`}>
      <div className="flex flex-col w-full max-w-md pt-10 mx-auto stretch">
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          {candidateChosen.name == "" ? "Select a candidate to start chatting" : "Chat about " + candidateChosen.name } 
          <br/>
          {(candidateChosen.name == "" && !matches) && <Button onClick={toggleSidebar} className='bg-blue-600 text-gray-900 font-semibold hover:bg-blue-400'>Choose</Button>}
        </Typography>
        <div className="message-container px-20" style={{ maxHeight: '75vh', overflowY: 'auto'}} ref={chatContainerRef}>
          {messages.length > 0
          ? messages.map((m:any, index:any) => (
              <div key={m.id} className={`message-container ${m.role}`}>
                <div className="message-content">
                  <ChatMessage message={m}/>
                </div>
                {(m.role !== "user" && data && data[0] && data[0].sources.length > 0) ? (
                  <Accordion sx={{borderRadius:'10px'}} >
                    <AccordionSummary className='accordion-sources-color'
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="h6">Sources used</Typography>
                    </AccordionSummary>
                    <AccordionDetails className='accordion-sources-color'>
                      <List>
                      {
                        display_list_items(data, index)
                      }
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ) : null}
                {index !== messages.length - 1 && <div className="divider" />}
              </div>
            ))
          : null}
        </div>
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={snackbarOpen.state} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarOpen.message}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={successSnackbarFeedback} autoHideDuration={2000} onClose={handleSnackbarFeedbackClose}>
        <Alert onClose={handleSnackbarFeedbackClose} severity="success" sx={{ width: '100%' }}>
          Feedback submitted!
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