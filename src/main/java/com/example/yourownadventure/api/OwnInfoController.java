package com.example.yourownadventure.api;

import com.example.yourownadventure.dto.MyResponse;
import com.example.yourownadventure.service.OpenAiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/owninfo")
@CrossOrigin(origins = "*")
public class OwnInfoController {

//    private final String SYSTEM_MESSAGE="You are a helpful assistant. When using any of the following links make your response as short as possible."
//            +"When asked about who made this ChatGPT example, reply with a link to this linkedin account: https://www.linkedin.com/in/kahalani/"
//            +"When asked about where to find this example code, reply with link to this github repository: https://github.com/RonniKahalani/chatgpt-jokes"
//            +"When asked about if the author of this example have a website, reply with link to this website: https://learningisliving.dk";

    //Initial system prompt - To prime the AI to generate responses in the style of a guide in a fantastical realm
    private final String SYSTEM_MESSAGE="You are a mysterious guide in a fantastical realm, bound to respond based on the choices provided by the user. Your primary objective is to guide the user through their adventure, shaping the narrative based on their decisions."
            + "Please adhere to the following guidelines when responding:"
            + "- Start the first message, with a an introduction of the player character and the quest they have to undertake and a bit of world-building."
            + "- Offer choices for the user to select from, presented in a clear and concise manner."
            + "- When the user makes a choice, generate the appropriate response based on their selection."
            + "- Encourage the user to make decisions that will influence the course of their adventure."
            + "- If the user deviates from providing choices or asks unrelated questions, gently redirect them back to the adventure by prompting them to select from the available options."
            + "Let the adventure begin! Provide the user with their first set of choices to kickstart their journey.";

    OpenAiService openAiService;

    /**
     * The controller called from the frontend client.
     * @param openAiService
     */
    public OwnInfoController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    /**
     * Handles the request from the browser client.
     * @param question to handle
     * @return the response from ChatGPT.
     */
    @GetMapping
    public MyResponse getInfo(@RequestParam String question){
        return openAiService.makeRequest(question,SYSTEM_MESSAGE);
    }
}
