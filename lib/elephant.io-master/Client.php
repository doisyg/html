<?php
/**
 * This file is part of the Elephant.io package
 *
 * For the full copyright and license information, please view the LICENSE file
 * that was distributed with this source code.
 *
 * @copyright Wisembly
 * @license   http://www.opensource.org/licenses/MIT-License MIT License
 */

namespace ElephantIO;

use ElephantIO\Exception\SocketException;

/**
 * Represents the IO Client which will send and receive the requests to the
 * websocket server. It basically suggercoat the Engine used with loggers.
 *
 * @author Baptiste Clavié <baptiste@wisembly.com>
 */
class Client
{
    /** @var EngineInterface */
    private $engine;


    private $isConnected = false;

    public function __construct(EngineInterface $engine, $logger = null)
    {
        $this->engine = $engine;
    }

    public function __destruct()
    {
        if (!$this->isConnected) {
            return;
        }

        $this->close();
    }

    /**
     * Connects to the websocket
     *
     * @return $this
     */
    public function initialize()
    {
        try {
            $this->engine->connect();
            
            $this->isConnected = true;
        } catch (SocketException $e) {
            throw $e;
        }

        return $this;
    }

    /**
     * Reads a message from the socket
     *
     * @return string Message read from the socket
     */
    public function read()
    {
        return $this->engine->read();
    }

    /**
     * Emits a message through the engine
     *
     * @param string $event
     * @param array  $args
     *
     * @return $this
     */
    public function emit($event, array $args)
    {
        $this->engine->emit($event, $args);

        return $this;
    }

    /**
     * Sets the namespace for the next messages
     *
     * @param string namespace the name of the namespace
     * @return $this
     */
    public function of($namespace)
    {
        $this->engine->of($namespace);

        return $this;
    }

    /**
     * Closes the connection
     *
     * @return $this
     */
    public function close()
    {
        $this->engine->close();

        $this->isConnected = false;

        return $this;
    }

    /**
     * Gets the engine used, for more advanced functions
     *
     * @return EngineInterface
     */
    public function getEngine()
    {
        return $this->engine;
    }
}
