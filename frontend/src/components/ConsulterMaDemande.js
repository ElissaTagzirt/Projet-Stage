import React ,{useState , useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { format } from 'date-fns';

const ConsulterMaDemande = () => {
    const { id: demandeId } = useParams();
    const [demandeData, setDemandeData] = useState();
    const { token } = useAuth();  

    const [changeStatueDemande , setChangeStatueDemande]=useState(false);
    const[demandechange , setDemandechange]=useState(false);
    const [VoirReponse, setVoirReponse]=useState(false);
    const [dataResponse , setdataResponse]=useState('');
    
    const navigate = useNavigate();  
    

      const annulerDemande = (e) => {
        e.preventDefault()
        const url = `http://127.0.0.1:8000/Demandes/AnnulerDemande/${demandeId}`;
    
        fetch(url, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}`
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur lors de la requête : ${response.status} ${response.statusText}`);
          }
          return response.json(); // Convertir la réponse en JSON
        })
        .then(data => {
          navigate('/user/mes-demandes');
        })
        .catch(error => {
          console.error('Erreur lors de la requête :', error);
          // Gérez les erreurs ici
        });
      }

      const ChangeStatue = (e) => {
        e.preventDefault();
    
        // Obtenez la valeur sélectionnée du select
        const select = document.querySelector('select[name="statue_demande"]');
        const selectedStatue = select.value;
    
        // URL de la requête PUT
        const url = `http://127.0.0.1:8000/Demandes/ChangeStatueDemande/${demandeId}/${selectedStatue}`;
    
        // Configuration de la requête
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
    
        // Envoi de la requête Fetch
        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête n\'a pas abouti.');
                }
                return response.json();
            })
            .then(data => {
                // Gérer la réponse ici
                console.log(data.detail);
            })
            .catch(error => {
                // Gérer les erreurs ici
                console.error(error);
            });
    }
     
      

    const handleClickSortire = (e) => {
        // Utilisez la fonction navigate pour changer de page
        navigate('/user/mes-demandes'); // Remplacez '/nouvelle-page' par l'URL de la nouvelle page
      };
    const handleClickModifie = (e) => {
        e.preventDefault()
        navigate(`/user/ModifieMaDemande/${demandeId}`);
      };   
    
    useEffect(() => {
        const fetchData = () => {
            fetch(`http://127.0.0.1:8000/Demandes/Getdemande/${demandeId}`, {
              headers: {
               Authorization: `Bearer ${token}` // Ajoutez le token aux en-têtes de la requête
              
            }
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('La requête n\'a pas abouti');
                }
                return response.json();
              })
              .then(newData => {
                setDemandeData(newData) 
                setDemandechange(false);
                
                // Mettre à jour l'état avec les nouvelles données
              })
              .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
              });
          };
          fetchData();
      }, [demandechange]);

      //----------------- Pour recupere Reponse de la demande  -----------------------------
function fetchResponseData() {
   
    // URL de l'API backend
    const apiUrl = `http://127.0.0.1:8000/ReponseDemande/GetResponse/${demandeId}/`;
  
    // En-têtes de la requête
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    // Effectuez la requête GET
    fetch(apiUrl, {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`La requête a échoué avec le statut : ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setdataResponse(data);
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
  }
  
    return (
        <div>
     {demandeData &&  <div className="shadow rounded m-4"> 
             <div className="flex items-center my-4 pl-8">
                            <p className="text-2xl  font-medium mt-5 leading-none text-teal-500">
                               Consulter ma demande :
                            </p>
              </div> 
            <div className="w-8/9 m-2">
                        <div className="flex items-center my-4 pl-8">
                            <p className="text-base font-medium mt-5 leading-none text-teal-500">
                              Détails de la demande :
                            </p>
                        </div>
                    <table className="w-full  text-sm font-light">
                    <tbody>
                       <tr >
                        <td className="whitespace-nowrap text-gray-500 px-6 py-4 font-medium">Numéro demande : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.IDDemande} </td>
                        </tr>
                        <tr >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Objet Demande : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.ObjetDemande}</td>
                        </tr>
                        <tr >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Description : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.Description}</td>
                        </tr>
                        <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Date création : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.DateCreation}</td>
                        </tr>
                        <tr >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Date dernier délai : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.DateDernieDelia}</td>
                        </tr>
                        <tr >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Date de modification : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.DateMiseAjour}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>        
            <div className="flex justify-between">
                <div className="w-1/2 m-2">
                        <div className="flex items-center my-4 pl-8">
                            <p className="text-base font-medium mt-5 leading-none text-teal-500">
                                Mes coordonnées :
                            </p>
                        </div>
                    <table className="w-full text-center text-sm font-light">
                    <tbody>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4  text-gray-500 font-medium">Nom : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonNom} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Email : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonEmail} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Téléphone : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonTelephone} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Poste : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonPoste} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Siége : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonSiege}</td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Service : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.MonService}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="w-1/2 m-2">
                    <div className="flex items-center my-4 pl-8">
                    <p className="text-base font-medium mt-5 leading-none text-teal-500">
                        Coordonnées du destinataire :
                    </p>
                    </div>
                    <table className="w-full text-center text-sm font-light">
                    <tbody>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Nom : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.DestinataireNom}</td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Email : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.destinataire_email} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Téléphone : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.DestinataireTel}</td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Poste : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.NomPosteDestinataire} </td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Siége : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.NomSiegeDestinataire}</td>
                        </tr>
                        <tr className='flex items-center border-b border-teal-500 ml-2'>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">Service : </td>
                        <td className="whitespace-pre-wrap px-6 py-4">{demandeData.NomServiceDestinataire}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                
            </div>


            <div className="flex items-center mt-8 pl-8 space-x-4">
                <p className="text-base font-medium mr-8 leading-none text-teal-500">
                    État de la demande :
                </p>
                {!changeStatueDemande ? (
                    <div className="flex items-center space-x-6">
                    <p className="text-base font-medium leading-none text-gray-500 mr-8">
                        {demandeData.StatueDemande}
                    </p>
                    <button
                       className="bg-teal-200 m-1  rounded-full"
                       onClick={(e) => {
                        e.preventDefault()
                        setChangeStatueDemande(true)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
             </div>
                ) : (
                    <div className="flex items-center space-x-2">
                    <select className="text-gray-500" name="statue_demande">
                    <option value="0">En attente</option>
                    <option value="5">Annuler</option>
                    </select>
                    <button
                    className="bg-teal-200 m-1  rounded-full"
                    onClick={(e) => {
                        e.preventDefault();
                        ChangeStatue(e);
                        setDemandechange(true);
                        setChangeStatueDemande(false);}}>
                
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    </div>
                )}
                </div>
    <div className="flex justify-end">
      <button 
      onClick={(e) => {
        e.preventDefault();
        if (VoirReponse===false)
        {
            fetchResponseData();
        }
        setVoirReponse(!VoirReponse);

      }}
      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 mr-8 rounded-full flex items-center">
      {!VoirReponse ? (<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 mr-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
        </svg>):(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
            )} 
        Voir Réponse
      </button>
    </div>



   { VoirReponse &&  (<div className="flex  mx-10 mt-10">
      {/* Conteneur du commentaire */}
      <div className=" w-full grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow">
        <div className=" flex gap-4">
          
          <div className="flex flex-col w-full">
            {/* Informations de l'utilisateur */}
            <div className="flex flex-row justify-between">
              <p className=" text-xl whitespace-nowrap truncate overflow-hidden text-teal-600 m-2">
              La réponse à votre demande
              </p>
              <a className="text-gray-500 text-xl" href="#">
                <i className="fa-solid fa-trash"></i>
              </a>
            </div>
            <p className="text-gray-400 text-sm ml-2">{dataResponse.DateCreation && format(new Date(dataResponse.DateCreation), "d MMMM yyyy, 'at' HH:mm a")} </p>
          </div>
        </div>
        {/* Contenu du commentaire */}
        <p className="mt-2 text-gray-500 ml-2">
          {dataResponse.Contenu}
        </p>
      </div>
      <button className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 fixed right-4 bottom-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
        </svg>
      </button>

    </div>
    
    
    
    ) }
          
                 


            <div className="overflow-x-auto">
                <div className="flex items-center my-8 pl-8">
                    <p className="text-base font-medium mt-5 leading-none text-teal-500">
                    La liste des outils de ma demande :
                    </p>
                </div>
                <div className="inline-block min-w-full py-2 px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <table className="w-full text-center text-sm font-light">
                    <thead className="border-b bg-teal-500  font-medium text-white">
                        <tr>
                        <th scope="col" className="px-6 py-4">Numéro</th>
                        <th scope="col" className="px-6 py-4">Nom Outil</th>
                        <th scope="col" className="px-6 py-4">Quantité</th>
                        <th scope="col" className="px-6 py-4">Description</th>
                        </tr>
                    </thead> 
                    <tbody>
                    
                    {demandeData.outils.map((outil, index) => (     <tr key ={index} className="border-b dark:border-neutral-500 focus:outline-none border border-gray-100  rounded">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">{index}</td>
                            <td className="whitespace-nowrap px-6 py-4">{outil.NomOutil}</td>
                            <td className="whitespace-nowrap px-6 py-4">{outil.Quantite}</td>
                            <td className="whitespace-pre-wrap px-6 py-4">{outil.Description}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>  

            
            <div className="flex  w-full  pl-4 m-4">
                <button 
                onClick={annulerDemande}
                className="flex-shrink-0 m-4 float-right bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                    Supprimer la demande
                </button>
                <button 
                onClick={handleClickModifie}
                className=" m-4 inset-y-0 right-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                    Modifier la demande
                </button>
                <button
                 onClick={handleClickSortire}
                 className=" m-4 inset-y-0 right-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                    Sortire
                </button>

            </div>
        </div> } </div>
    )
}
export default ConsulterMaDemande;