const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;
const connection = new Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");
let publicKey = null; // Placeholder for the user's public key
let headsCount = 0;
let tailsCount = 0;
let programId = new PublicKey("9t4VojyeFGiqKjM71LPPgaWKQ1ZDK94htYxoGSnviAyx"); // Your Program ID
let recipientPublicKey = new PublicKey("BvKeWCU3nsfW5VpzKhMd7atD5i5qeEQ2ga2t5coDagNr"); // Recipient Public Key

document.getElementById("connect-wallet-button").addEventListener("click", async () => {
    if (window.solana) {
        try {
            const wallet = await window.solana.connect();
            publicKey = wallet.publicKey;
            document.getElementById("flip-button").style.display = "inline-block";
            document.getElementById("reset-button").style.display = "inline-block";
            document.getElementById("status").textContent = `Connected with public key: ${publicKey.toString()}`;
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("Please install a Solana wallet like Phantom.");
    }
});

document.getElementById("flip-button").addEventListener("click", async () => {
    const isHeads = Math.random() < 0.5;
    const coin = document.getElementById("coin");
    
    if (isHeads) {
        coin.style.transform = "rotateY(0deg)";
        headsCount++;
        document.getElementById("heads-count").textContent = `Heads: ${headsCount}`;
    } else {
        coin.style.transform = "rotateY(180deg)";
        tailsCount++;
        document.getElementById("tails-count").textContent = `Tails: ${tailsCount}`;
    }
    
    try {
        // Create a transaction and transfer a small amount of SOL (replace 0.001 with the desired amount)
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPublicKey,
                lamports: 0.001 * LAMPORTS_PER_SOL, // Transfer 0.001 SOL
            })
        );

        // Send and confirm the transaction
        const signature = await window.solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature);

        document.getElementById("status").textContent = `Transaction successful with signature: ${signature}`;
    } catch (error) {
        console.error("Transaction failed:", error);
        document.getElementById("status").textContent = "Transaction failed. Check console for details.";
    }
});

document.getElementById("reset-button").addEventListener("click", () => {
    headsCount = 0;
    tailsCount = 0;
    document.getElementById("heads-count").textContent = "Heads: 0";
    document.getElementById("tails-count").textContent = "Tails: 0";
    document.getElementById("status").textContent = "";
});

});
