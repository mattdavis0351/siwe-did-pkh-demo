// Ceramic dependencies
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DIDDataStore } from '@glazed/did-datastore'
import { DIDSession } from '@glazed/did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

// arbitrary internal dependencies
import { walletButton } from './utils/header'
import { renderProfileData } from './utils/profile'
import { renderAddressBookData } from './utils/address'


// Create Ceramic Client and connect to Clay Testnet
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com")

// Reference the datamodels we want to  use so that they can be placed in the datastore
const publishedModel = {
    schemas: {
        basicProfile: 'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
        addressBook: "ceramic://k3y52l7qbv1frxycyoblevfvx12ws5t0iuqmrwiadl36p20ectvw9yuhs4g9uruv4"

    },
    definitions: {
        BasicProfile: 'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
        AddressBook: "kjzl6cwe1jw149hy5kge1gqmp669kvn2c0xmnrr109wajqrwteg9mdmlalzaku4",
    },
    tiles: {},
}


// Initialize the datastore using the models we just referenced
const datastore = new DIDDataStore({ ceramic, model: publishedModel })



// Setup some variables to cache the profile and address book data
let profileData = {}
let addressBookData = {}

// Create function that connects to the ethereum provider and authenticates the user
async function authenticateWithEthereum(ethereumProvider) {
    const accounts = await ethereumProvider.request({
        method: 'eth_requestAccounts',
    })

    const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0])

    const session = new DIDSession({ authProvider })

    const did = await session.authorize()

    ceramic.did = did
}

// Create auth function that will be called when the user clicks the wallet button
async function auth() {
    if (window.ethereum == null) {
        throw new Error('No injected Ethereum provider')
    }
    await authenticateWithEthereum(window.ethereum)
}

// Add an event listener to the wallet button that calls the auth function and then renders the profile data and address book data
walletButton.addEventListener('click', async () => {
    try {
        await auth()

        walletButton.innerHTML = 'Disconnect'

        // use the datastore to get the profile data and address book data
        profileData = await datastore.get('BasicProfile')
        addressBookData = await datastore.get('AddressBook')

        renderProfileData(profileData)
        renderAddressBookData(addressBookData)

    } catch (e) {
        console.error(e)
    }
})


// write changes to the addressbook stream associated with the user when they submit the form
document.getElementById('addressform').addEventListener('submit', async (e) => {
    e.preventDefault()
    const contactName = document.getElementById('contactName').value
    const walletAddress = document.getElementById('walletAddress').value
    const network = document.getElementById('network').value

    const contact = {
        name: contactName,
        wallets: [{
            walletAddress,
            network
        }]
    }

    if (addressBookData === null) {
        addressBookData = { total_cnt: 0, contacts: [] }
    }
    addressBookData.contacts.push(contact)

    const book = {
        total_cnt: addressBookData.contacts.length,
        contacts: addressBookData.contacts
    }

    // use the datastore to set the addressbook data
    await datastore.set('AddressBook', book)

    renderAddressBookData(addressBookData)

})