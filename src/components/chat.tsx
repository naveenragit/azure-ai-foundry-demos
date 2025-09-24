import React, { useState, useEffect } from 'react';
import type { ChatMessage } from '../types/index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function Chat() {



    const [isLoading_Select, setIsLoading_Select] = useState(true);
    const [isLoading_Message, setIsLoading_Message] = useState(false);

    const [agents, setAgents] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedAgentDisplayName, setSelectedAgentDisplayName] = useState('');


    const [chatHistory, setChatHistory] = useState<string>('');
    const [systemMessage, setSystemMessage] = useState<string>('');
    const [vectorEmbedding, setVectorEmbedding] = useState<string>('');
    const [searchResult, setsearchResult] = useState<string>('');
    const [currentResponse, setCurrentResponse] = useState<string>('');


    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const [currentUIMessage, setCurrentUIMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // Mock data for agents - replace with your actual API call
            const mockAgents = [
                'Customer Service Agent',
                'Technical Support Agent', 
                'Sales Agent',
                'General Assistant',
                'Product Expert'
            ];
            
            // Simulate API delay
            setTimeout(() => {
                setAgents(mockAgents);
                setIsLoading_Select(false);
            }, 500);
            
            // Replace above with your actual API call:
            // try {
            //     const response = await fetch('/api/agents');
            //     const data = await response.json();
            //     setAgents(data);
            //     setIsLoading_Select(false);
            // } catch (error) {
            //     console.error('Error fetching agents:', error);
            //     setIsLoading_Select(false);
            // }
        };
        
        if (isLoading_Select) {
            fetchData();
        }
    }, [isLoading_Select]);


    //Not userd and can be removed
    //function getFirstName(fullName: string): string {
    //    let parts = fullName.split(' ');
    //    return parts[0];
    //}



    // Function to handle sending a message
    const sendMessage = async (message: string) => {
        if (!message || !selectedAgent) return;

        setIsLoading_Message(true);

        const newUserMessage: ChatMessage = { sender: 'user', text: "You : " + message };
        setChatMessages(prevMessages => [...prevMessages, newUserMessage]);

        try {
            // Replace this with your actual agent API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent: selectedAgent,
                    message: message,
                    chatHistory: chatHistory
                }),
            });

            const dataJson = await response.json();
            console.log(dataJson);

            // Update chat history and response
            setChatHistory(dataJson.chatHistory || chatHistory + '\nUser: ' + message);
            setCurrentResponse(dataJson.response || 'Agent response here');

            // Add bot message
            const botMessage: ChatMessage = { 
                sender: 'agent', 
                text: selectedAgentDisplayName + " : " + (dataJson.response || 'Hello! How can I help you today?') 
            };
            setChatMessages(prevMessages => [...prevMessages, botMessage]);
            setIsLoading_Message(false);

        } catch (error) {
            console.error('Error fetching Chat Response:', error);
            
            // Fallback response for demo purposes
            const fallbackResponse = `Thank you for your message. I'm ${selectedAgentDisplayName} and I'm here to help you.`;
            const botMessage: ChatMessage = { 
                sender: 'agent', 
                text: selectedAgentDisplayName + " : " + fallbackResponse 
            };
            setChatMessages(prevMessages => [...prevMessages, botMessage]);
            setIsLoading_Message(false);
        }

        setCurrentUIMessage('');
    };

    // Filter out duplicates
    const uniqueAgents = agents.filter(
        (agent, index, self) => index === self.indexOf(agent)
    );

    // Handle Enter key in the chat input
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage(currentUIMessage);
        }   
    };

    const ClearChatHistory = () => {
        setChatHistory('');
        setCurrentResponse('');
        setSystemMessage('');
        setVectorEmbedding('');
        setsearchResult('');
        setChatMessages([]);
    };

    // Handle change in the agent dropdown
    const handleAgentChange = (value: string) => {
        setSelectedAgent(value);
        setSelectedAgentDisplayName(value);
        ClearChatHistory();
    };

    const [sectionVisible, setSectionVisible] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const handleUnderTheHoodChange = (checked: boolean) => {
        setChecked(checked);
        setSectionVisible(checked);
    };

    return (
        <>
            
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundImage: 'url(/RobotsBckground3.png)',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backgroundBlendMode: 'overlay',
                }}
            >
                <div style={{ marginTop: '16px', width: '600px', padding: 0, margin: 0, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>

                <div style={{ margin: '20px' }}>
                    <div style={{ display: 'inline-block', marginRight: '20px' }}>
                        <Label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>Select an Agent</Label>
                        <Select onValueChange={handleAgentChange} value={selectedAgent}>
                            <SelectTrigger style={{ width: '300px' }}>
                                <SelectValue placeholder="Choose an agent to chat with" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueAgents.map((agent, index) => (
                                    <SelectItem key={index} value={agent}>
                                        {agent}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div >
                    <div style={{ height: '400px', overflow: 'auto', border: '1px solid #d3d3d3', marginBottom: '10px' }}>
                        {chatMessages.map((message, index) => (
                            <div key={index} style={{ marginBottom: '10px', marginTop: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div >
                    <div>

                        <Input 
                            disabled={isLoading_Message}
                            placeholder="Type your message..."
                            value={currentUIMessage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentUIMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            style={{
                                width: '90%',
                                paddingRight: '10px'
                            }}
                        />
                        <Button onClick={() => sendMessage(currentUIMessage)} variant="outline" style={{
                            marginRight: '10px',
                            height: '100%'
                        }}>Send</Button>
                    </div>
                    <div>

                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Checkbox checked={checked} onCheckedChange={handleUnderTheHoodChange} />
                            <Label>Look under the hood</Label>
                        </div>
                        {sectionVisible && (
                            <div>
                                <Accordion type="multiple" style={{ marginTop: '20px' }}>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>System Message for the agent</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{systemMessage}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Vector Embedding</AccordionTrigger>
                                        <AccordionContent>
                                            <p style={{ wordWrap: 'break-word' }}>{vectorEmbedding}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Search Result</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{searchResult}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Chat History</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{chatHistory}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Current Response</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{currentResponse}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        )}

                    </div>
                </div>

                </div>
            </div>
        </>
    );

}

export default Chat;
