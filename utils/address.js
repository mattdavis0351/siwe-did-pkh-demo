export function renderAddressBookData(data) {
    if (!data) return
    const contactList = document.getElementById('contacts')

    // clear contactList
    contactList.innerHTML = ''

    data.contacts.forEach(contact => {
        const contactItem = document.createElement('li')
        const contactName = document.createElement('h4')
        contactItem.classList.add('contact')
        contactName.innerHTML = contact.name
        contactItem.appendChild(contactName)

        contact.wallets.forEach(wallet => {
            const walletItem = document.createElement('p')
            walletItem.innerHTML = "<p>" + wallet.walletAddress + "</p><p>" + wallet.network + "</p>"
            contactItem.appendChild(walletItem)
        })

        contactList.appendChild(contactItem)

    }
    )
}