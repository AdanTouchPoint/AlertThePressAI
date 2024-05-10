import React, {useState} from 'react'
import Button from "react-bootstrap/cjs/Button";
import Modal from 'react-bootstrap/Modal';
import { fetchLeads } from '../assets/petitions/fetchLeads';

const  ListSelect = ({setValidated,setError,emails,tac,setShowListSelect,setAllDataIn, mp, dataUser,  setEmailData,  setShowFindForm, setHideIAPrompt, setShowMainContainer, showMainContainer, emailData, leads, setLeads, backendURLBase, endpoints, clientId}) => {
  const [checklistStates, setChecklistStates] = useState(emails?.map(() => true) || []);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async() => setShow(true);

    const toggleChecklist = (index) => {
      const newChecklistStates = [...checklistStates];
      newChecklistStates[index] = !newChecklistStates[index];
      setChecklistStates(newChecklistStates);
    };
    const isValidEmail = (email) => {
      if(!email){
        return false
      }
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email.trim());
    };
    const click = async() => {
      console.log(dataUser, 'dataUser')
      if (!isValidEmail(dataUser.emailUser) || tac === false ||  Object.getOwnPropertyNames(dataUser).length === 0 || dataUser.userName === undefined  || dataUser.emailUser === undefined  ) {
        setError(true);
        // console.log('Field validator', fieldValidator())
        return;
      }
      setValidated(true);
      //setShowLoadSpin(true);
      setError(false);
      const selectedMps = await emails.filter((email, index) => checklistStates[index]);
      //const selectedEmails = await selectedMps.map((mp) => mp.email ? mp.email.trim() : mp.contact.trim());
      if(checklistStates.every(state => !state)) {
        handleShow();
        setHideIAPrompt(true);
        setShowFindForm(true);

      } else {
        setAllDataIn(selectedMps);
        setEmailData({
          ...dataUser
        });
        setHideIAPrompt(false);
        setShowFindForm(true);
        setShowMainContainer(true);
        fetchLeads(
          true,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          'NA',
          'Multiples-representatives-selected-lead'
        );
        setLeads(leads + 1)
      }
    };
    return (
        <>
        <div hidden={showMainContainer} className={'buttons-list-container list-container'}>
            {emails?.map((email, index) => (
                <label key={index} className='list-mp-row' >
                    <input
                        id="representativeList-checkbox"
                        type='checkbox'
                        checked={checklistStates[index]}
                        onChange={() => toggleChecklist(index)}
                        className='form-check-input'
                    />
                    <h5 className='list-mp-row-info'>
                      {email}
                    </h5>
                </label>
            ))}
        </div>
        <div className='btn-container-checklist'>
          <div>
            <Button id="representativeList-button" className='continue-button' size={'lg'}  onClick={click}>
              Continue
            </Button>
          </div>
        </div>
        <Modal show={show} onHide={handleClose} className='advice-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Advice</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please check the box of at least one representative</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default ListSelect

