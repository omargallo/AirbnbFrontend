import { inject, Injectable } from "@angular/core";
import { ChatSessionDto } from "../Message/message.service";



@Injectable( { providedIn:'root'} )

// Cache type: language => (chatId => Chat)

export class ChatCacheService{
    
    chatCache: Map<string, Map<string, ChatSessionDto>> = new Map();



}
